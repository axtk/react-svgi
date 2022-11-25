import type {SVGImageProps} from './types';
import {xmlns} from '../lib/xmlns';

export const SVGErrorImage = ({
    src,
    alt,
    nonce,
    style,
    onDataError,
    ...props
}: SVGImageProps) => (
    <svg xmlns={xmlns} {...props} ref={element => element && onDataError?.()}>
        {alt && <title>{alt}</title>}
    </svg>
);
