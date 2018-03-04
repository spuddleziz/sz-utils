import { Schema } from "./Schema";
export declare class SZAlternatives extends Schema<any> {
    _oneOf: Array<Schema<any>>;
    constructor();
    setOneOf(oneOfArray: Array<Schema<any>>): void;
    toJSON(): any;
}
