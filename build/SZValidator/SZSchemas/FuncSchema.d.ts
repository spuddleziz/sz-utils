import { AnySchema } from "./AnySchema";
import { SZNotAllowed } from "../JSONSchema/NotAllowed";
export declare class FuncSchema extends AnySchema {
    internalJSONSchema: SZNotAllowed;
    _classMode: boolean;
    constructor();
    class(enableClassMode?: boolean): this;
    validate(value: any): any;
}
