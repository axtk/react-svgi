import {memo, useRef} from 'react';
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
    let svgImageId = useRef(props.id ?? `svg-${Math.random().toString(36).slice(2)}`);

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

    let innerContent = content.substring(k1 + 1, k2).trim()
        // normalizing the whitespaces to even out the mismatch of the
        // server-side and client-side rendering
        .replace(/>\s+<([\w\-:]+[>\s\/])/g, '> <$1');

    let styles: string[] = [];
    let contentProps = parseAttrs(content.substring(k0 + 4, k1)) as SVGAttributes<SVGElement>;

    if (contentProps.style !== undefined) {
        styles.push(`#${svgImageId.current} {${contentProps.style}}`);
        delete contentProps.style;
    }

    if (alt !== undefined) {
        if (innerContent.toLowerCase().includes('</title>'))
            innerContent = innerContent.replace(
                /<title(\s+[^>]+)?>([^<]+)?<\/title>/i,
                `<title$1>${alt}</title>`,
            );
        else innerContent = `<title>${alt}</title> ${innerContent}`;
    }

    if (nonce !== undefined) {
        let styleIndices: [number, number][] = [];
        let s = innerContent.toLowerCase();
        let i0 = 0, i1 = 0;

        while ((i0 = s.search(/<style(\s|>|$)/)) !== -1) {
            i0 += i1;
            i1 = s.indexOf('</style>', i0);

            if (i1 === -1) break;

            let style = innerContent.substring(i0, i1)
                .replace(/^<style(\s+[^>]+)?>/i, '')
                .replace(/<\/style>$/, '');

            styles.push(style);
            styleIndices.push([i0, i1 + 8]);

            s = s.substring(i1);
        }

        for (let [i0, i1] of styleIndices.reverse())
            innerContent = innerContent.slice(0, i0) + innerContent.slice(i1);
    }

    return (
        <svg
            xmlns={xmlns}
            {...contentProps}
            {...svgProps}
            dangerouslySetInnerHTML={{__html: innerContent}}
            ref={element => {
                if (!element || typeof window === 'undefined' || styles.length === 0 || !nonce)
                    return;

                let styleNode = document.querySelector('style.react-svgi');

                if (!styleNode) {
                    styleNode = document.createElement('style');
                    styleNode.setAttribute('nonce', nonce);
                    styleNode.className = 'react-svgi';

                    document.head.appendChild(styleNode);
                }

                styleNode.innerHTML += ('\n' + styles.join('\n'))
                    .replace(
                        /(^|\})\s*([^\{\}]+)(\{)/g,
                        `$1 #${svgImageId.current} $2$3`,
                    )
                    .replace(
                        new RegExp(`#${svgImageId.current}\\s+#${svgImageId.current}`, 'g'),
                        `#${svgImageId.current}`,
                    );

                element.id = svgImageId.current;
            }}
        />
    );
});
