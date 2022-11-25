import {toggleStyleAttribute} from './toggleStyleAttribute';

const removeSvgId = (element: Element | null) => element?.removeAttribute('data-svg-id');

export function setStyle(
    styleMap: Record<string, string>,
    svgId: string,
    nonce?: string | undefined,
) {
    if (nonce && svgId) {
        let svgElement = document.querySelector(`[data-svg-id="${svgId}"]`);
        let styleElement = svgElement?.querySelector('style.inline-styles');

        if (!styleElement) {
            if (!svgElement || Object.keys(styleMap).length === 0)
                return;

            styleElement = document.createElement('style');
            styleElement.className = 'inline-styles';
            styleElement.setAttribute('nonce', nonce);

            svgElement.appendChild(styleElement);
        }

        let styleContent = styleElement.textContent ?? '';
        let nextStyleContent = '', hasStyles = false;

        for (let line of styleContent.split('\n')) {
            if (line.startsWith(`[data-svg-id="${svgId}"]`) || line.startsWith(`[data-svg-id="${svgId}-`)) {
                if (hasStyles) continue;

                for (let [id, style] of Object.entries(styleMap))
                    nextStyleContent += `\n[data-svg-id="${id}"] {${style}}`;

                hasStyles = true;
            }
            else if (line.trim())
                nextStyleContent += `\n${line}`;
        }

        if (!hasStyles) {
            for (let [id, style] of Object.entries(styleMap))
                nextStyleContent += `\n[data-svg-id="${id}"] {${style}}`;
        }

        if (!nextStyleContent) {
            styleElement.remove();
            return;
        }

        if (nextStyleContent !== styleContent)
            styleElement.textContent = nextStyleContent;

        return;
    }

    let relatedElements = document.querySelectorAll(`[data-svg-id^="${svgId}-"]`);

    for (let element of Array.from(relatedElements ?? []))
        toggleStyleAttribute(
            element,
            styleMap[element.getAttribute('data-svg-id') ?? ''],
            removeSvgId,
        );

    for (let [id, style] of Object.entries(styleMap))
        toggleStyleAttribute(
            document.querySelector(`[data-svg-id="${id}"]`),
            style,
            removeSvgId,
        );
}
