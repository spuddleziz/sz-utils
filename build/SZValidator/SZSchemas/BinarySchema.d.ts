/// <reference types="node" />
import { AnySchema } from "./AnySchema";
import { SZBinaryBuffer } from "../JSONSchema/BinaryBuffer";
export declare enum BinarySchemaEncodingOption {
    ASCII = "ascii",
    UTF8 = "utf8",
    UCS2 = "ucs2",
    UTF16LE = "utf16le",
    BASE64 = "base64",
    LATIN1 = "latin1",
    BINARY = "binary",
    HEX = "hex",
}
export declare class BinarySchema extends AnySchema {
    internalJSONSchema: SZBinaryBuffer;
    private _encoding;
    _minLength: number;
    _maxLength: number;
    constructor();
    valid(...values: Array<Buffer | string | Uint8Array>): this;
    invalid(...values: Array<Buffer | string | Uint8Array>): this;
    encoding(encoding: BinarySchemaEncodingOption): this;
    min(limit: number): this;
    max(limit: number): this;
    length(limit: number): this;
    validate(value: Buffer | string | Uint8Array): any;
}
