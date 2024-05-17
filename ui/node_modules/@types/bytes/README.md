# Installation
> `npm install --save @types/bytes`

# Summary
This package contains type definitions for bytes (https://github.com/visionmedia/bytes.js).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/bytes.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/bytes/index.d.ts)
````ts
/**
 * Convert the given value in bytes into a string.
 */
declare function bytes(value: number, options?: bytes.BytesOptions): string;

/**
 * Parse string to an integer in bytes.
 */
declare function bytes(value: string): number;

declare namespace bytes {
    type Unit = "b" | "gb" | "kb" | "mb" | "pb" | "tb" | "B" | "GB" | "KB" | "MB" | "PB" | "TB";

    interface BytesOptions {
        decimalPlaces?: number | undefined;
        fixedDecimals?: boolean | undefined;
        thousandsSeparator?: string | undefined;
        unit?: Unit | undefined;
        unitSeparator?: string | undefined;
    }

    /**
     * Format the given value in bytes into a string.
     *
     * If the value is negative, it is kept as such.
     * If it is a float, it is rounded.
     */
    function format(value: number, options?: BytesOptions): string;

    /**
     * Parse the string value into an integer in bytes.
     *
     * If no unit is given, it is assumed the value is in bytes.
     */
    function parse(value: string | number): number;
}

export = bytes;

````

### Additional Details
 * Last updated: Mon, 06 Nov 2023 22:41:05 GMT
 * Dependencies: none

# Credits
These definitions were written by [Zhiyuan Wang](https://github.com/danny8002), [Rickard Laurin](https://github.com/believer), and [Florian Keller](https://github.com/ffflorian).
