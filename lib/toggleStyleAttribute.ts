export function toggleStyleAttribute(
    element: Element | null,
    style: string | undefined,
    callback?: (element: Element | null) => void,
) {
    if (!element)
        return;

    if (style && element.getAttribute('style') !== style)
        element.setAttribute('style', style);

    if (!style && element.hasAttribute('style'))
        element.removeAttribute('style');

    callback?.(element);
}
