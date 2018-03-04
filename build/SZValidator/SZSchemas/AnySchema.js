"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
const Any_1 = require("../JSONSchema/Any");
class AnySchema extends BaseSchema_1.BaseSchema {
    constructor(inType) {
        super(inType || BaseSchema_1.SZSchemaTypes.Any);
        this.internalJSONSchema = new Any_1.SZAny();
    }
    validate(value) {
        let valStack = AnySchema.preValidate(this, value);
        if (valStack.immediate === true)
            return AnySchema.postValidate(this, valStack.value, value);
        return AnySchema.postValidate(this, valStack.value, value);
    }
}
exports.AnySchema = AnySchema;
//# sourceMappingURL=AnySchema.js.map