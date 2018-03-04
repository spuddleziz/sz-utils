import { AnySchema } from "./SZSchemas/AnySchema";
import { ArraySchema } from "./SZSchemas/ArraySchema";
import { BooleanSchema } from "./SZSchemas/BooleanSchema";
import { BinarySchema } from "./SZSchemas/BinarySchema";
import { DateSchema } from "./SZSchemas/DateSchema";
import { StringSchema } from "./SZSchemas/StringSchema";
import { ObjectSchema } from "./SZSchemas/ObjectSchema";
import { IDictionary } from "../IDictionary";
import { NumberSchema } from "./SZSchemas/NumberSchema";
import { FuncSchema } from "./SZSchemas/FuncSchema";
import { AlternativesSchema } from "./SZSchemas/AlternativesSchema";
export interface ISZSchemaBuilderOptions {
    convert: boolean;
}
export declare class SZSchemaBuilder {
    static getOptions(): ISZSchemaBuilderOptions;
    static setOptions(inOpts: ISZSchemaBuilderOptions): void;
    static any(): AnySchema;
    static array(): ArraySchema;
    static boolean(): BooleanSchema;
    static binary(): BinarySchema;
    static date(): DateSchema;
    static func(): FuncSchema;
    static number(): NumberSchema;
    static object(objectSchemaMap?: IDictionary<AnySchema>): ObjectSchema;
    static string(): StringSchema;
    static alternatives(altSchemas?: Array<AnySchema>): AlternativesSchema;
}
