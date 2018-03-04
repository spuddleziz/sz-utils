import { Schema } from "./Schema";
export declare enum StringFormats {
    Uri = "uri",
    Email = "email",
}
export declare class SZString extends Schema<string> {
    pattern: string;
    minLength: number;
    maxLength: number;
    format: StringFormats;
    _oneOf: Array<SZString>;
    constructor();
    setPatterns(inPatterns: Array<string | RegExp | Array<string | RegExp>>): this;
    setPattern(inPattern: string | RegExp): this;
    setMinLength(min: number): this;
    setMaxLength(max: number): this;
    setLength(length: number): this;
    setFormat(stringFormat: StringFormats): this;
    toJSON(): any;
}
