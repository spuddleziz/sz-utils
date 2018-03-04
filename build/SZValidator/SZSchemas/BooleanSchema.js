"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
const AnySchema_1 = require("./AnySchema");
const Boolean_1 = require("../JSONSchema/Boolean");
const lodash_1 = require("lodash");
const SchemaError_1 = require("../SchemaError");
class BooleanSchema extends AnySchema_1.AnySchema {
    constructor() {
        super(BaseSchema_1.SZSchemaTypes.Boolean);
        this._truthyVals = [];
        this._falseyVals = [];
        this._insensitiveMode = false;
        this.internalJSONSchema = new Boolean_1.SZBoolean();
    }
    truthy(value) {
        if (Array.isArray(value) && value.length > 0) {
            const self = this;
            value.forEach((val) => {
                self.truthy.call(self, val);
            });
        }
        else if (typeof value === "string" && this._truthyVals.indexOf(value) === -1) {
            this._truthyVals.push(value);
        }
        else if (typeof value === "number" && this._truthyVals.indexOf(value) === -1) {
            this._truthyVals.push(value);
        }
        return this;
    }
    falsey(value) {
        if (Array.isArray(value) && value.length > 0) {
            const self = this;
            value.forEach((val) => {
                self.falsey.call(self, val);
            });
        }
        else if (typeof value === "string" && this._falseyVals.indexOf(value) === -1) {
            this._falseyVals.push(value);
        }
        else if (typeof value === "number" && this._falseyVals.indexOf(value) === -1) {
            this._falseyVals.push(value);
        }
        return this;
    }
    insensitive(enableInsensitive) {
        if (enableInsensitive === false) {
            this._insensitiveMode = false;
        }
        else {
            this._insensitiveMode = true;
        }
        return this;
    }
    validate(value) {
        let valStack = AnySchema_1.AnySchema.preValidate(this, value);
        if (valStack.immediate)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        if (typeof valStack.value === "boolean") {
            //check valids/invalids!
            valStack = AnySchema_1.AnySchema.checkInvalid(this, valStack);
            //check valids
            valStack = AnySchema_1.AnySchema.checkValid(this, valStack);
            if (valStack.immediate === true)
                return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        }
        let foundInsensitive = null;
        let lowerVal = null;
        if (typeof valStack.value === "string") {
            lowerVal = valStack.value.toLowerCase();
        }
        if (this._truthyVals.length > 0) {
            if (this._insensitiveMode === true) {
                foundInsensitive = lodash_1.filter(this._truthyVals, (val) => {
                    if (typeof val === "string" && lowerVal) {
                        return (val.toLowerCase() === lowerVal);
                    }
                    else {
                        return val === valStack.value;
                    }
                });
                if (foundInsensitive.length > 0) {
                    return AnySchema_1.AnySchema.postValidate(this, true, value);
                }
                foundInsensitive = null;
            }
            else {
                if (this._truthyVals.indexOf(valStack.value) >= 0) {
                    return AnySchema_1.AnySchema.postValidate(this, true, value);
                }
            }
        }
        if (this._falseyVals.length > 0) {
            if (this._insensitiveMode === true) {
                foundInsensitive = lodash_1.filter(this._falseyVals, (val) => {
                    if (typeof val === "string" && lowerVal) {
                        return (val.toLowerCase() === lowerVal);
                    }
                    else {
                        return val === valStack.value;
                    }
                });
                if (foundInsensitive.length > 0) {
                    return AnySchema_1.AnySchema.postValidate(this, false, value);
                }
                foundInsensitive = null;
            }
            else {
                if (this._falseyVals.indexOf(valStack.value) >= 0) {
                    return AnySchema_1.AnySchema.postValidate(this, false, value);
                }
            }
        }
        throw new SchemaError_1.SchemaValidationFailedError(`Supplied value is not a boolean or isn't in the allowed thruth/falsey values.`);
    }
}
exports.BooleanSchema = BooleanSchema;
//# sourceMappingURL=BooleanSchema.js.map