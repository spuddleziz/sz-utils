import { AnySchema } from "./AnySchema";
import { Schema } from "../JSONSchema/Schema";
import { ISZSchemaBuilderOptions } from "../Builder";
import { SchemaValidationFailedError } from "../SchemaError";
export declare enum SZSchemaTypes {
    Any = "AnySchema",
    Array = "ArraySchema",
    Boolean = "BooleanSchema",
    Binary = "BinarySchema",
    Date = "DateSchema",
    Func = "FuncSchema",
    Number = "NumberSchema",
    Object = "ObjectSchema",
    String = "StringSchema",
    Alternatives = "AlternativesSchema",
}
export interface SchemaWhenConditionOptions {
    is?: AnySchema;
    then?: AnySchema;
    otherwise?: AnySchema;
}
export declare class SchemaWhenCondition {
    conditionKey: string;
    is: AnySchema;
    then: AnySchema;
    otherwise: AnySchema;
    constructor(condition: string | AnySchema, options: SchemaWhenConditionOptions);
}
export declare class BaseSchema<T> {
    protected _buildJSONSchema: object;
    protected _compiledSchema: any;
    internalJSONSchema: Schema<T>;
    protected _invalids: Array<T>;
    protected _whenConditions: Array<SchemaWhenCondition>;
    protected _rawMode: boolean;
    protected _emptySchema: AnySchema;
    protected _emptyValue: T;
    protected _customError: Error;
    protected _customErrorFunc: Function;
    schemaType: SZSchemaTypes;
    strictMode: boolean;
    protected _unit: string;
    protected _meta: any;
    protected _notes: Array<string>;
    protected _tags: Array<string>;
    protected _options: ISZSchemaBuilderOptions;
    constructor(schemaType: SZSchemaTypes);
    protected _checkArrayOfItemsType(typeOfString: any, values: any): boolean;
    protected _checkPassedArrayOfValueType(values: Array<T>): boolean;
    protected _checkPassedValueType(value: T): boolean;
    options(inOptions: ISZSchemaBuilderOptions): this;
    description(description: string): this;
    label(label: string): this;
    tags(tag: string): this;
    tags(tags: Array<string>): this;
    meta(value: any): this;
    notes(notes: string): this;
    notes(notes: Array<string>): this;
    concat(inSchema: AnySchema): this;
    when(condition: string | AnySchema, options: SchemaWhenConditionOptions): this;
    strict(setStrict?: boolean): this;
    raw(rawEnabled?: boolean): this;
    strip(stripEnabled?: boolean): this;
    forbidden(forbiddenEnabled?: boolean): this;
    required(): this;
    exist(): this;
    optional(): this;
    empty(value?: AnySchema | T): this;
    default(value: T): this;
    valid(...values: Array<T>): this;
    allow(...values: Array<T>): this;
    allowNull(): this;
    only(...values: Array<T>): this;
    equal(...values: Array<T>): this;
    invalid(...values: Array<T>): this;
    disallow(...values: Array<T>): this;
    not(...values: Array<T>): this;
    example(...examples: Array<T>): this;
    error(err: Error | Function): this;
    protected generateError(rule: string, message: string): SchemaValidationFailedError;
    getJSONSchema(): any;
    validate(value: any): any;
    static checkValid(schema: AnySchema, valStack: {
        value: any;
        immediate: boolean;
    }): {
        value: any;
        immediate: boolean;
    };
    static checkInvalid(schema: AnySchema, valStack: {
        value: any;
        immediate: boolean;
    }): {
        value: any;
        immediate: boolean;
    };
    static preValidate(schema: AnySchema, value: any): {
        value: any;
        immediate: boolean;
    };
    static postValidate(schema: AnySchema, validatedValue: any, rawValue: any): any;
}
