import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZArray} from "../JSONSchema/Array";
import {SZAny} from "../JSONSchema/Any";
import {SchemaValidationFailedError} from "../SchemaError";
import {AnySchema} from "./AnySchema";
import {SZNumber} from "../JSONSchema/Number";
import * as assert from "assert";


const NumberSchemaStringIntegerRegex:RegExp = /^-?\d+$/;
const NumberSchemaPositiveStringIntegerRegex:RegExp = /^\d+$/;
const NumberSchemaNegativeStringIntegerRegex:RegExp = /^-\d+$/;

const NumberSchemaStringFloatRegex:RegExp = /^-?\d+(\.\d+)*$/;
const NumberSchemaPositiveStringFloatRegex:RegExp = /^\d+(\.\d+)*$/;
const NumberSchemaNegativeStringFloatRegex:RegExp = /^-\d+(\.\d+)*$/;


export class NumberSchema extends AnySchema {

  public internalJSONSchema:SZNumber;

  _minLimit:number;
  _maxLimit:number;
  _multipleOf:number;
  _precision:number;

  _positiveMode:boolean = false;
  _negativeMode:boolean = false;
  _integerMode:boolean = false;
  _inclusiveMin:boolean = true;
  _inclusiveMax:boolean = true;


  constructor() {

    super(SZSchemaTypes.Number);

    this.internalJSONSchema = new SZNumber();

    this._positiveMode = false;
    this._negativeMode = false;
    this._integerMode  = false;

  }

  min(limit:number):this {

    assert(typeof limit === "number", `Supplied minimum limit must be a number`);

    this._inclusiveMin = true;

    this._minLimit = limit;

    return this;

  }

  max(limit:number):this {

    assert(typeof limit === "number", `Supplied maximum limit must be a number`);

    this._inclusiveMax = true;

    this._maxLimit = limit;

    return this;

  }

  greater(limit:number):this {

    assert(typeof limit === "number", `Supplied greater than limit must be a number`);

    this._inclusiveMin = false;

    this._minLimit = limit;

    return this;

  }

  less(limit:number):this {

    assert(typeof limit === "number", `Supplied less than limit must be a number`);

    this._inclusiveMax = false;

    this._maxLimit = limit;

    return this;

  }

  precision(limit:number):this {

    assert(typeof limit === "number" && limit >= 0, `Supplied precision limit must be a number and greater than or equal to 0`);

    this._precision = limit;

    return this;

  }

  multiple(base:number):this {

    assert(typeof base === "number" && base > 0, `Supplied multiple limit must be a number and greater than 0`);

    this._multipleOf = base;

    return this;

  }

  positive():this {

    this._positiveMode = true;

    this._negativeMode = false;

    return this;

  }

  negative():this {

    this._negativeMode = true;

    this._positiveMode = false;

    return this;

  }

  integer():this {

    this._integerMode = true;

    return this;

  }

  validate(value:number|string) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

    valStack = AnySchema.checkInvalid(this, valStack);

    //check valids

    valStack = AnySchema.checkValid(this, valStack);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

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

    return AnySchema.postValidate(this, valStack.value, value);

  }

}


