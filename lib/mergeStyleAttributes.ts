export function mergeStyleAttributes(...styleAttributes: Array<string | undefined>) {
    let mergedProperties: Record<string, string> = {};

    for (let style of styleAttributes) {
        if (!style?.trim())
            continue;

        let propertyStrings = style.match(/\s*([\w\-:]+)\s*:\s*([^;]+)\s*(;|$)/g) ?? [];

        for (const propertyString of propertyStrings) {
            let [, key, value] = propertyString.match(/\s*([\w\-:]+)\s*:\s*([^;]+)\s*(;|$)/) ?? [];

            if (key && value !== undefined)
                mergedProperties[key] = value;
        }
    }

    let mergedStyle = '';

    for (let [key, value] of Object.entries(mergedProperties))
        mergedStyle += `${mergedStyle ? ' ' : ''}${key}: ${value};`;

    return mergedStyle;
}
