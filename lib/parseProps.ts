import {toCamelCase} from './toCamelCase';

export function parseProps(x: string): Record<string, unknown> {
    let attrs: Record<string, unknown> = {};
    let attrStrings = x.trim().match(/([\w\-:]+)=["']([^"]+)["']/g) ?? [];

    for (const attrString of attrStrings) {
        let [, key, value] = attrString.match(/([\w\-:]+)=["']([^"]+)["']/) ?? [];

        if (!key || value === undefined)
            continue;

        key = toCamelCase(key);

        if (key === 'class')
            key = 'className';

        try {
            attrs[key] = JSON.parse(value);
        }
        catch {
            attrs[key] = value;
        }
    }

    return attrs;
}
