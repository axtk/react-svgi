export type ToggleStyleOptions = {
    nonce?: string;
    id?: string;
};

export function toggleStyle(
    svgElement: SVGSVGElement,
    style: string | undefined,
    {nonce, id}: ToggleStyleOptions = {},
) {
    if (nonce && id) {
        let styleElement = document.querySelector('style.react-svgi');

        if (!styleElement) {
            if (!style) return;

            styleElement = document.createElement('style');
            styleElement.className = 'react-svgi';
            styleElement.setAttribute('nonce', nonce);
            document.head.appendChild(styleElement);
        }

        let styleContent = styleElement.textContent ?? '';
        let nextStyleContent = '';

        for (let line of styleContent.split('\n')) {
            if (!line.startsWith(`#${id} `)) {
                nextStyleContent += `\n${line}`;
                continue;
            }

            if (!style)
                continue;

            nextStyleContent += `\n#${id} {${style}}`;
        }

        if (!nextStyleContent) {
            styleElement.remove();
            return;
        }

        if (nextStyleContent !== styleContent)
            styleElement.textContent = nextStyleContent;

        return;
    }

    if (style && svgElement.getAttribute('style') !== style)
    svgElement.setAttribute('style', style);

    if (!style && svgElement.hasAttribute('style'))
        svgElement.removeAttribute('style');
}
