"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
const SchemaError_1 = require("../SchemaError");
const AnySchema_1 = require("./AnySchema");
const Alternatives_1 = require("../JSONSchema/Alternatives");
const Utils_1 = require("../Utils");
class AlternativesSchema extends AnySchema_1.AnySchema {
    constructor(tryAlternatives) {
        super(BaseSchema_1.SZSchemaTypes.Alternatives);
        this._alternativeTry = [];
        this.internalJSONSchema = new Alternatives_1.SZAlternatives();
        if (tryAlternatives && Array.isArray(tryAlternatives) && tryAlternatives.length > 0) {
            this.try.apply(this, tryAlternatives);
        }
    }
    try(...alternatives) {
        alternatives = Utils_1.SZValidatorUtils.coerceArgs(alternatives);
        this._alternativeTry = alternatives;
        return this;
    }
    validate(value) {
        let valStack = AnySchema_1.AnySchema.preValidate(this, value);
        if (valStack.immediate === true)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        //need to iterate the try alternatives!
        if (!this._alternativeTry || !Array.isArray(this._alternativeTry) || this._alternativeTry.length === 0) {
            throw this.generateError(`noAlternativesToTry`, "There are no alternative schemas to try.");
        }
        let tryAltLen = this._alternativeTry.length;
        let tryAltSchema = null;
        let validationErrors = new SchemaError_1.SchemaValidationErrors(this);
        for (let tryAltIndex = 0; tryAltIndex < tryAltLen; tryAltIndex++) {
            //try each one for validation.. lets see if we succeed!
            tryAltSchema = this._alternativeTry[tryAltIndex];
            if (tryAltSchema && tryAltSchema instanceof AnySchema_1.AnySchema) {
                try {
                    valStack.value = tryAltSchema.validate(valStack.value);
                }
                catch (ex) {
                    ex.message = `tryAlternativeValidationError: ${ex.message}`;
                    validationErrors.setIndexError(tryAltIndex, ex, valStack.value);
                }
            }
        }
        return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
    }
}
exports.AlternativesSchema = AlternativesSchema;
//# sourceMappingURL=AlternativesSchema.js.map