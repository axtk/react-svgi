import {xmlns} from './xmlns';

export function setTitle(svgElement: SVGSVGElement, title: string | undefined) {
    let titleElement = svgElement.querySelector('title') as SVGTitleElement | null;

    if (!titleElement && title !== undefined) {
        titleElement = document.createElementNS(xmlns, 'title');

        if (svgElement.firstChild)
            svgElement.insertBefore(titleElement, svgElement.firstChild);
        else svgElement.appendChild(titleElement);
    }

    if (titleElement && title !== undefined && titleElement.textContent !== title)
        titleElement.textContent = title;

    if (titleElement && title === undefined)
        titleElement.remove();
}
