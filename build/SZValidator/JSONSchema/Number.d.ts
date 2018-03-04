import { Schema } from "./Schema";
export declare class SZNumber extends Schema<number> {
    minimum: number;
    exclusiveMinimum: boolean;
    maximum: number;
    exclusiveMaximum: boolean;
    constructor();
    setInteger(): void;
    setMinimum(min: number, exclusive?: boolean): void;
    setMaximum(max: number, exclusive?: boolean): void;
}
