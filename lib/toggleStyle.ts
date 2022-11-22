import {xmlns} from './xmlns';

export function toggleStyle(svgElement: SVGSVGElement | null, style: string | undefined) {
    if (!svgElement)
        return;

    if (style && svgElement.getAttributeNS(xmlns, 'style') !== style)
        svgElement.setAttributeNS(xmlns, 'style', style);

    if (!style && svgElement.hasAttributeNS(xmlns, 'style'))
        svgElement.removeAttributeNS(xmlns, 'style');
}
