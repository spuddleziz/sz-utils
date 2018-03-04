import { Schema } from "./Schema";
import { IDictionary } from "../../IDictionary";
export declare class SZObject extends Schema<object> {
    _properties: IDictionary<Schema<any>>;
    _required: Array<string>;
    additionalProperties: boolean;
    _keyPattern: {
        regex: string;
        rule: Schema<any>;
    };
    constructor();
    setAdditionalProperties(additionalPropsEnabled?: boolean): this;
    setProperties(inProperties: IDictionary<Schema<any>>): void;
    setKeyPattern(regex: string | RegExp, rule: Schema<any>): void;
    toJSON(): any;
}
