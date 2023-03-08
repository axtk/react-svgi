import {toCamelCase} from './toCamelCase';

export function parseCSS(style: string | undefined): Record<string, unknown> {
    let parsedProperties: Record<string, unknown> = {};
    let propertyStrings = style?.match(/\s*([\w\-:]+)\s*:\s*([^;]+)\s*(;|$)/g) ?? [];

    for (const propertyString of propertyStrings) {
        let [, key, value] = propertyString.match(/\s*([\w\-:]+)\s*:\s*([^;]+)\s*(;|$)/) ?? [];

        if (key && value !== undefined)
            parsedProperties[toCamelCase(key)] = /^\-?\d+px$/.test(value) ? parseInt(value, 10) : value;
    }

    return parsedProperties;
}
