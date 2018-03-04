import { AnySchema } from "./AnySchema";
import { SZArray } from "../JSONSchema/Array";
export declare class ArrayItemSchemaMissing extends Error {
    constructor();
}
export declare class ArraySchema extends AnySchema {
    _sparseMode: boolean;
    _singleMode: boolean;
    _itemSchemas: Array<AnySchema>;
    _comparatorFunction: Function;
    _comparatorKey: string;
    _ordered: Array<AnySchema>;
    internalJSONSchema: SZArray<any>;
    constructor();
    sparse(sparseModeOn?: boolean): this;
    single(singleModeOn?: boolean): this;
    items(...itemSchemas: Array<AnySchema>): this;
    ordered(...orderedSchemas: Array<AnySchema>): this;
    min(limit: number): this;
    max(limit: number): this;
    length(limit: number): this;
    unique(comparator?: Function | string): this;
    itemValidate(value: any): any;
    validate(value: Array<any> | any): any;
}
