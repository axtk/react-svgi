export function parseAttrs(x: string): Record<string, string> {
    let attrs: Record<string, string> = {};
    let attrStrings = x.trim().match(/([\w\-:]+)=["']([^"]+)["']/g) ?? [];

    for (const attrString of attrStrings) {
        let matches = attrString.match(/([\w\-:]+)=["']([^"]+)["']/);
        if (matches && matches.length > 2)
            attrs[matches[1]] = matches[2]; 
    }

    return attrs;
}
