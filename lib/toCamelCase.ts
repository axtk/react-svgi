export function toCamelCase(x: string): string {
    return x.replace(/[-:]\w/g, s => s[1].toUpperCase());
}
