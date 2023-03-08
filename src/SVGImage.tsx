import {memo} from 'react';
import {decodeBase64} from '../lib/decodeBase64';
import {parseCSS} from '../lib/parseCSS';
import {parseProps} from '../lib/parseProps';
import {xmlns} from '../lib/xmlns';
import type {SVGImageProps} from './types';
import {SVGErrorImage} from './SVGErrorImage';

export const SVGImage = memo((props: SVGImageProps) => {
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

    let outputStyle = {
        ...parseCSS(contentStyle as string | undefined),
        ...style,
    };

    if (alt) {
        let lowerCaseInnerContent = innerContent.toLowerCase();
        let k0 = lowerCaseInnerContent.search(/<title(\s|>|$)/);
        let k1 = lowerCaseInnerContent.indexOf('</title>', k0);

        if (k0 !== -1 && k1 !== -1) {
            innerContent = innerContent.substring(0, k0) +
                `<title>${alt}</title>` +
                innerContent.substring(k1 + 8);
        }
        else innerContent = `<title>${alt}</title>` + innerContent;
    }

    return (
        <svg
            xmlns={xmlns}
            {...contentProps}
            {...componentProps}
            style={outputStyle}
            dangerouslySetInnerHTML={{__html: innerContent}}
        />
    );
});
