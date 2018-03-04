import { AnySchema } from "./AnySchema";
import { SZAlternatives } from "../JSONSchema/Alternatives";
export declare class AlternativesSchema extends AnySchema {
    internalJSONSchema: SZAlternatives;
    _alternativeTry: Array<AnySchema>;
    constructor(tryAlternatives?: Array<AnySchema>);
    try(...alternatives: Array<AnySchema>): this;
    validate(value: any): any;
}
