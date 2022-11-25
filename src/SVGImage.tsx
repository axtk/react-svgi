import {memo, useRef} from 'react';
import toStyleAttribute from 'react-style-object-to-css';
import {getRandomString} from '../lib/getRandomString';
import {decodeBase64} from '../lib/decodeBase64';
import {parseProps} from '../lib/parseProps';
import {mergeStyleAttributes} from '../lib/mergeStyleAttributes';
import {setTitle} from '../lib/setTitle';
import {setStyle} from '../lib/setStyle';
import {xmlns} from '../lib/xmlns';
import type {SVGImageProps} from './types';
import {SVGErrorImage} from './SVGErrorImage';

export const SVGImage = memo((props: SVGImageProps) => {
    let svgId = useRef(getRandomString());

    let {src, alt, style, nonce, onDataError, ...componentProps} = props;
    let [, type, base64, content] = src?.match(/^data:\s*([^;,]+)?(;\s*base64)?,\s*(.*)$/) ?? [];

    if (!/^image\/svg\b/.test(type) || typeof content !== 'string')
        return <SVGErrorImage {...props}/>;

    content = decodeURIComponent(base64 ? decodeBase64(content) : content);

    let lowerCaseContent = content.toLowerCase();
    let k0 = lowerCaseContent.search(/<svg(\s|>|$)/);
    let k1 = content.indexOf('>', k0);

    if (k0 === -1 || k1 === -1)
        return <SVGErrorImage {...props}/>;

    let k2 = lowerCaseContent.lastIndexOf('</svg>');
    if (k2 === -1) k2 = content.length;

    let innerContent = content.substring(k1 + 1, k2).trim();
    let {style: contentStyle, ...contentProps} = parseProps(content.substring(k0 + 4, k1));

    let styleMap: Record<string, string> = {};

    if (nonce !== undefined) {
        innerContent = innerContent.replace(
            /<style(\s+[^>]+)?>/gi,
            `<style nonce="${nonce}"$1>`,
        );

        innerContent = innerContent.replace(
            /(\s)style=['"]([^'"]+)['"](\s|>|$)/gi,
            (...matches) => {
                let id = `${svgId.current}-${getRandomString()}`;
                let style = matches[2];

                styleMap[id] = style;

                return ` data-svg-id=${id}${matches[3]}`;
            },
        )
    }

    return (
        <svg
            xmlns={xmlns}
            {...contentProps}
            {...componentProps}
            ref={element => {
                if (!element || typeof window === 'undefined')
                    return;

                // setting the content here instead of the `dangerouslySetInnerHTML` prop
                // helps avoid the mismatch of the server-side and client-side rendering
                if (element.innerHTML !== innerContent)
                    element.innerHTML = innerContent;

                if (element.dataset.svgId !== svgId.current)
                    element.dataset.svgId = svgId.current;

                // setting the React `style` prop to the outer <svg> and the string
                // style extracted from the content to an inner <svg> without the need
                // to merge these styles can fail in some cases, since an inner <svg>
                // doesn't support all the CSS features available to an outer <svg>
                // (like setting a background color); setting the merged style to the
                // outer <svg> is solving this
                let mergedStyle = mergeStyleAttributes(
                    contentStyle as string | undefined,
                    toStyleAttribute(style),
                );

                if (mergedStyle)
                    styleMap[svgId.current] = mergedStyle;

                // the style attribute is set in the client-side rendering phase to
                // avoid a likely mismatch against the server-side rendering output
                // (which could skip rendering styles altogether);
                setStyle(styleMap, svgId.current, nonce);
                setTitle(element, alt);
            }}
        >
            {alt && <title>{alt}</title>}
        </svg>
    );
});
