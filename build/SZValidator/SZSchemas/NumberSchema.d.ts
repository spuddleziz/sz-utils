import { AnySchema } from "./AnySchema";
import { SZNumber } from "../JSONSchema/Number";
export declare class NumberSchema extends AnySchema {
    internalJSONSchema: SZNumber;
    _minLimit: number;
    _maxLimit: number;
    _multipleOf: number;
    _precision: number;
    _positiveMode: boolean;
    _negativeMode: boolean;
    _integerMode: boolean;
    _inclusiveMin: boolean;
    _inclusiveMax: boolean;
    constructor();
    min(limit: number): this;
    max(limit: number): this;
    greater(limit: number): this;
    less(limit: number): this;
    precision(limit: number): this;
    multiple(base: number): this;
    positive(): this;
    negative(): this;
    integer(): this;
    validate(value: number | string): any;
}
