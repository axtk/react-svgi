export function decodeBase64(x: string): string {
    if (typeof atob !== 'undefined')
        return atob(x);
    if (typeof Buffer !== 'undefined')
        return Buffer.from(x, 'base64').toString();
    return '';
}
