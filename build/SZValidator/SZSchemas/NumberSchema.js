"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
const AnySchema_1 = require("./AnySchema");
const Number_1 = require("../JSONSchema/Number");
const assert = require("assert");
const NumberSchemaStringIntegerRegex = /^-?\d+$/;
const NumberSchemaPositiveStringIntegerRegex = /^\d+$/;
const NumberSchemaNegativeStringIntegerRegex = /^-\d+$/;
const NumberSchemaStringFloatRegex = /^-?\d+(\.\d+)*$/;
const NumberSchemaPositiveStringFloatRegex = /^\d+(\.\d+)*$/;
const NumberSchemaNegativeStringFloatRegex = /^-\d+(\.\d+)*$/;
class NumberSchema extends AnySchema_1.AnySchema {
    constructor() {
        super(BaseSchema_1.SZSchemaTypes.Number);
        this._positiveMode = false;
        this._negativeMode = false;
        this._integerMode = false;
        this._inclusiveMin = true;
        this._inclusiveMax = true;
        this.internalJSONSchema = new Number_1.SZNumber();
        this._positiveMode = false;
        this._negativeMode = false;
        this._integerMode = false;
    }
    min(limit) {
        assert(typeof limit === "number", `Supplied minimum limit must be a number`);
        this._inclusiveMin = true;
        this._minLimit = limit;
        return this;
    }
    max(limit) {
        assert(typeof limit === "number", `Supplied maximum limit must be a number`);
        this._inclusiveMax = true;
        this._maxLimit = limit;
        return this;
    }
    greater(limit) {
        assert(typeof limit === "number", `Supplied greater than limit must be a number`);
        this._inclusiveMin = false;
        this._minLimit = limit;
        return this;
    }
    less(limit) {
        assert(typeof limit === "number", `Supplied less than limit must be a number`);
        this._inclusiveMax = false;
        this._maxLimit = limit;
        return this;
    }
    precision(limit) {
        assert(typeof limit === "number" && limit >= 0, `Supplied precision limit must be a number and greater than or equal to 0`);
        this._precision = limit;
        return this;
    }
    multiple(base) {
        assert(typeof base === "number" && base > 0, `Supplied multiple limit must be a number and greater than 0`);
        this._multipleOf = base;
        return this;
    }
    positive() {
        this._positiveMode = true;
        this._negativeMode = false;
        return this;
    }
    negative() {
        this._negativeMode = true;
        this._positiveMode = false;
        return this;
    }
    integer() {
        this._integerMode = true;
        return this;
    }
    validate(value) {
        let valStack = AnySchema_1.AnySchema.preValidate(this, value);
        if (valStack.immediate === true)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        valStack = AnySchema_1.AnySchema.checkInvalid(this, valStack);
        //check valids
        valStack = AnySchema_1.AnySchema.checkValid(this, valStack);
        if (valStack.immediate === true)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        let strVal = null;
        if (typeof valStack.value === "number") {
            strVal = valStack.value.toString();
        }
        else {
            strVal = (valStack.value && valStack.value.toString && typeof valStack.value.toString === "function" ? valStack.value.toString() : "NO_STRING");
        }
        if (this._integerMode) {
            if (this._positiveMode === true && NumberSchemaPositiveStringIntegerRegex.test(strVal)) {
                valStack.value = parseInt(strVal);
            }
            else if (this._negativeMode === true && NumberSchemaNegativeStringIntegerRegex.test(strVal)) {
                valStack.value = parseInt(strVal);
            }
            else if (!this._negativeMode && !this._positiveMode && NumberSchemaStringIntegerRegex.test(strVal)) {
                valStack.value = parseInt(strVal);
            }
            else {
                throw this.generateError("integerError", `The supplied number ${strVal} could not be determined as an integer. PositiveMode: ${this._positiveMode} | NegativeMode: ${this._negativeMode}.`);
            }
        }
        else {
            if (this._positiveMode === true && NumberSchemaPositiveStringFloatRegex.test(strVal)) {
                valStack.value = parseFloat(strVal);
            }
            else if (this._negativeMode === true && NumberSchemaNegativeStringFloatRegex.test(strVal)) {
                valStack.value = parseFloat(strVal);
            }
            else if (!this._negativeMode && !this._positiveMode && NumberSchemaStringFloatRegex.test(strVal)) {
                valStack.value = parseFloat(strVal);
            }
            else {
                throw this.generateError("numberError", `The supplied number ${strVal} could not be determined as a float. PositiveMode: ${this._positiveMode} | NegativeMode: ${this._negativeMode}.`);
            }
            if (this._precision && this._precision >= 0) {
                strVal = valStack.value.toString();
                let decimalIndex = strVal.indexOf(".");
                if (decimalIndex >= 0) {
                    let precLen = strVal.split(".")[1].length;
                    if (this._options.convert === true && precLen > this._precision) {
                        valStack.value = parseFloat(valStack.value.toFixed(this._precision));
                    }
                    else if (precLen > this._precision) {
                        throw this.generateError("precisionRule", `The supplied number ${strVal} has an exponent that is larger than the required precision and convert mode is disabled.`);
                    }
                }
            }
        }
        if (isNaN(valStack.value)) {
            throw this.generateError("number", `The supplied number ${strVal} is not a valid number.`);
        }
        if (this._multipleOf && this._multipleOf > 0 && valStack.value % this._multipleOf !== 0) {
            throw this.generateError("multipleOfRule", `The supplied number ${strVal} is not a multiple of ${this._multipleOf}.`);
        }
        if (this._minLimit !== null && this._minLimit !== undefined && ((this._inclusiveMin === true && valStack.value < this._minLimit) || (!this._inclusiveMin && valStack.value <= this._minLimit))) {
            throw this.generateError("minRule", `The supplied number ${strVal} is less than the allowed minimum value.`);
        }
        if (this._maxLimit !== null && this._maxLimit !== undefined && ((this._inclusiveMax === true && valStack.value > this._maxLimit) || (!this._inclusiveMax && valStack.value >= this._maxLimit))) {
            throw this.generateError("maxRule", `The supplied number ${strVal} is more than the allowed maximum value.`);
        }
        return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
    }
}
exports.NumberSchema = NumberSchema;
//# sourceMappingURL=NumberSchema.js.map