import { AnySchema } from "./SZSchemas/AnySchema";
export declare class SchemaValidationFailedError extends Error {
    constructor(msg: any);
}
export declare class SchemaValidationErrorItem {
    schema: AnySchema;
    originalError: Error;
    value: any;
    key: string;
    index: number;
    message: string;
    constructor(itemSchema: AnySchema, originalError: Error);
    setKey(key: string): this;
    setIndex(index: number): this;
    setValue(value: any): this;
    setError(error: Error): void;
}
export declare class SchemaValidationErrors {
    value: any;
    thisError: SchemaValidationErrorItem;
    itemErrors: Array<SchemaValidationErrorItem>;
    schema: AnySchema;
    message: string;
    name: string;
    constructor(inSchema: AnySchema);
    setValue(value: any): this;
    setError(originalError: Error): this;
    setKeyError(key: string, originalError: Error, value: any): this;
    setIndexError(index: number, originalError: Error, value: any): this;
    makeError(): WrappedSchemaValidationError | WrappedSchemaValidationErrors;
}
export declare class WrappedSchemaValidationErrors extends Error {
    constructor(name: string, msg: string);
}
export declare class WrappedSchemaValidationError extends Error {
    constructor(error: Error);
}
