import { BaseSchema, SZSchemaTypes } from "./BaseSchema";
import { SZAny } from "../JSONSchema/Any";
export declare class AnySchema extends BaseSchema<any> {
    internalJSONSchema: SZAny;
    constructor(inType?: SZSchemaTypes);
    validate(value: any): any;
}
