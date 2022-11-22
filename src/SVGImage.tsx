import {memo} from 'react';
import type {SVGAttributes} from 'react';
import {decodeBase64} from '../lib/decodeBase64';
import {parseAttrs} from '../lib/parseAttrs';

const xmlns = 'http://www.w3.org/2000/svg';

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
    let {src, alt, nonce, onDataError, ...svgProps} = props;
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
    let {style: selfStyle, ...contentProps} = parseAttrs(content.substring(k0 + 4, k1));

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
            {...svgProps}
            ref={element => {
                if (!element || typeof window === 'undefined')
                    return;

                if (typeof selfStyle === 'string')
                    element.setAttribute('style', selfStyle);

                // setting the content here instead of the `dangerouslySetInnerHTML` prop
                // helps avoid the mismatch of the server-side and client-side rendering
                if (element.innerHTML !== innerContent)
                    element.innerHTML = innerContent;

                let titleNode = element.querySelector('title') as SVGTitleElement | null;

                if (!titleNode && alt !== undefined) {
                    titleNode = document.createElementNS(xmlns, 'title');

                    if (element.firstChild)
                        element.insertBefore(titleNode, element.firstChild);
                    else element.appendChild(titleNode);
                }

                if (titleNode && alt !== undefined && titleNode.textContent !== alt)
                    titleNode.textContent = alt;

                if (titleNode && alt === undefined)
                    titleNode.remove();
            }}
        >
            {alt && <title>{alt}</title>}
        </svg>
    );
});
