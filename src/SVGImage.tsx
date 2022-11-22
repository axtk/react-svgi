import {memo, useState, useEffect} from 'react';
import type {SVGAttributes} from 'react';
import {decodeBase64} from '../lib/decodeBase64';
import {parseProps} from '../lib/parseProps';
import {toggleTitle} from '../lib/toggleTitle';
import {toggleStyle} from '../lib/toggleStyle';
import {xmlns} from '../lib/xmlns';

export type SVGImageProps = SVGAttributes<SVGElement> & {
    src?: string;
    alt?: string;
    nonce?: string;
    onDataError?: () => void;
};

export const SVGErrorImage = ({src, alt, onDataError, ...props}: SVGImageProps) => (
    <svg xmlns={xmlns} {...props} ref={element => element && onDataError?.()}>
        <title>{alt}</title>
    </svg>
);

export const SVGImage = memo((props: SVGImageProps) => {
    let {src, alt, style, nonce, onDataError, ...componentProps} = props;
    let [, type, base64, content] = src?.match(/^data:\s*([^;,]+)?(;\s*base64)?,\s*(.*)$/) ?? [];

    let [componentStyle, setComponentStyle] = useState<typeof style | undefined>();

    useEffect(() => {
        // the displayed style is first set inside the effect to skip
        // server-side rendering and to avoid a likely mismatch with
        // the client-side output
        if (componentStyle !== style)
            setComponentStyle(style);
    }, [style, componentStyle]);

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

    let innerContent = `<svg>${content.substring(k1 + 1, k2).trim()}</svg>`;
    let {style: contentStyle, ...contentProps} = parseProps(content.substring(k0 + 4, k1));

    if (nonce !== undefined && innerContent.toLowerCase().includes('</style>')) {
        innerContent = innerContent.replace(
            /<style(\s+[^>]+)?>/gi,
            `<style nonce="${nonce}"$1>`,
        );
    }

    return (
        <svg
            xmlns={xmlns}
            {...contentProps}
            {...componentProps}
            style={componentStyle}
            ref={element => {
                if (!element || typeof window === 'undefined')
                    return;

                // setting the content here instead of the `dangerouslySetInnerHTML` prop
                // helps avoid the mismatch of the server-side and client-side rendering
                if (element.innerHTML !== innerContent)
                    element.innerHTML = innerContent;

                toggleStyle(element.querySelector('svg'), contentStyle as string | undefined);
                toggleTitle(element, alt);
            }}
        >
            {alt && <title>{alt}</title>}
        </svg>
    );
});
