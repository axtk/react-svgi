# react-svgi

*React SVGImage component*

- converts an SVG image encoded as a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) (`'data:image/svg+xml,...'`) into a React `<svg>` component;
- accepts all SVG attributes;
- accepts an optional `nonce` value for nested styles (via the `nonce` prop);
- can set its own nested `<title>` to make the component more accessible (via the `alt` prop).

Code:

```tsx
<SVGImage
    src={imageDataURL}
    alt="Abstract shapes"
    width={240}
    height={120}
/>
```

Result:

```tsx
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120">
    <title>Abstract shapes</title>
    ...
</svg>
```
