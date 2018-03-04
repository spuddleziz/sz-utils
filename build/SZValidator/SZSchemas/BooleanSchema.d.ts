import { SZAny } from "../JSONSchema/Any";
import { AnySchema } from "./AnySchema";
export declare class BooleanSchema extends AnySchema {
    internalJSONSchema: SZAny;
    _truthyVals: Array<number | string>;
    _falseyVals: Array<number | string>;
    _insensitiveMode: boolean;
    constructor();
    truthy(value: Array<number | string> | number | string): this;
    falsey(value: Array<number | string> | number | string): this;
    insensitive(enableInsensitive?: boolean): this;
    validate(value: boolean | string | number): any;
}
