import type {SVGAttributes} from 'react';

export type SVGImageProps = SVGAttributes<SVGElement> & {
    src?: string;
    alt?: string;
    nonce?: string;
    onDataError?: () => void;
};
