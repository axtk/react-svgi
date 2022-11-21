import type {SVGAttributes} from 'react';
import {decodeBase64} from '../lib/decodeBase64';
import {parseAttrs} from '../lib/parseAttrs';

const xmlns = 'http://www.w3.org/2000/svg';

export type SVGImageProps = SVGAttributes<SVGElement> & {
    src?: string;
    alt?: string;
    onDataError?: () => void;
};

export const SVGErrorImage = ({src, alt, onDataError, ...props}: SVGImageProps) => (
    <svg xmlns={xmlns} {...props} ref={element => element && onDataError?.()}>
        <title>{alt}</title>
    </svg>
);

export const SVGImage = (props: SVGImageProps) => {
    let {src, alt, onDataError, ...svgProps} = props;
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

    let contentProps = parseAttrs(content.substring(k0 + 4, k1)) as SVGAttributes<SVGElement>;

    if (alt !== undefined) {
        if (innerContent.toLowerCase().includes('</title>'))
            innerContent = innerContent.replace(
                /<title(\s+[^>]+)?>([^<]+)?<\/title>/i,
                `<title$1>${alt}</title>`,
            );
        else innerContent = `<title>${alt}</title> ${innerContent}`;
    }

    return (
        <svg
            xmlns={xmlns}
            {...contentProps}
            {...svgProps}
            dangerouslySetInnerHTML={{__html: innerContent}}
        />
    );
};
