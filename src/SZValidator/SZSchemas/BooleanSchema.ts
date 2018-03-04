import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZAny} from "../JSONSchema/Any";
import {AnySchema} from "./AnySchema";
import {SZBoolean} from "../JSONSchema/Boolean";
import {filter} from "lodash";
import {SchemaValidationFailedError} from "../SchemaError";

export class BooleanSchema extends AnySchema {

  public internalJSONSchema:SZAny;

  _truthyVals:Array<number|string> = [];
  _falseyVals:Array<number|string> = [];
  _insensitiveMode:boolean = false;

  constructor() {

    super(SZSchemaTypes.Boolean);

    this.internalJSONSchema = new SZBoolean();

  }

  truthy(value:Array<number|string>|number|string) {

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

  falsey(value:Array<number|string>|number|string) {

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

  insensitive(enableInsensitive?:boolean) {

    if (enableInsensitive === false) {

      this._insensitiveMode = false;

    }
    else {

      this._insensitiveMode = true;

    }

    return this;

  }

  validate(value:boolean|string|number) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate) return AnySchema.postValidate(this, valStack.value, value);

    if (typeof valStack.value === "boolean") {

      //check valids/invalids!

      valStack = AnySchema.checkInvalid(this, valStack);

      //check valids

      valStack = AnySchema.checkValid(this, valStack);

      if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

      return AnySchema.postValidate(this, valStack.value, value);

    }

    let foundInsensitive:Array<any> = null;

    let lowerVal = null;

    if (typeof valStack.value === "string") {

      lowerVal = valStack.value.toLowerCase();

    }

    if (this._truthyVals.length > 0) {

      if (this._insensitiveMode === true) {

        foundInsensitive = filter(this._truthyVals, (val) => {

          if (typeof val === "string" && lowerVal) {

            return (val.toLowerCase() === lowerVal);

          }
          else {

            return val === valStack.value;

          }

        });

        if (foundInsensitive.length > 0) {
          return AnySchema.postValidate(this, true, value);
        }

        foundInsensitive = null;

      }
      else {

        if (this._truthyVals.indexOf(valStack.value) >= 0) {
          return AnySchema.postValidate(this, true, value);
        }

      }

    }

    if (this._falseyVals.length > 0) {

      if (this._insensitiveMode === true) {

        foundInsensitive = filter(this._falseyVals, (val) => {

          if (typeof val === "string" && lowerVal) {

            return (val.toLowerCase() === lowerVal);

          }
          else {

            return val === valStack.value;

          }

        });

        if (foundInsensitive.length > 0) {
          return AnySchema.postValidate(this, false, value);
        }

        foundInsensitive = null;

      }
      else {

        if (this._falseyVals.indexOf(valStack.value) >= 0) {
          return AnySchema.postValidate(this, false, value);
        }

      }

    }

    throw new SchemaValidationFailedError(`Supplied value is not a boolean or isn't in the allowed thruth/falsey values.`);

  }

}
