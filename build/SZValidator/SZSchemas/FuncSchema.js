"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
const AnySchema_1 = require("./AnySchema");
const NotAllowed_1 = require("../JSONSchema/NotAllowed");
class FuncSchema extends AnySchema_1.AnySchema {
    constructor() {
        super(BaseSchema_1.SZSchemaTypes.Func);
        this._classMode = false;
        this.internalJSONSchema = new NotAllowed_1.SZNotAllowed();
    }
    class(enableClassMode) {
        if (enableClassMode === false) {
            this._classMode = false;
        }
        else {
            this._classMode = true;
        }
        return this;
    }
    validate(value) {
        let valStack = AnySchema_1.AnySchema.preValidate(this, value);
        if (valStack.immediate === true)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        if (typeof valStack.value !== "function") {
            throw this.generateError(`notFunction`, "The supplied item is not a function.");
        }
        return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
    }
}
exports.FuncSchema = FuncSchema;
//# sourceMappingURL=FuncSchema.js.map