import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZArray} from "../JSONSchema/Array";
import {SZAny} from "../JSONSchema/Any";
import {SchemaValidationFailedError} from "../SchemaError";
import {SZDate} from "../JSONSchema/Date";
import {AnySchema} from "./AnySchema";
import * as moment from "moment";


export enum DateSchemaTimestampType {

  JAVASCRIPT= "javascript",
  UNIX = "unix"

}

const DEFAULT_TIMESTAMP_TYPE:DateSchemaTimestampType = DateSchemaTimestampType.JAVASCRIPT;

function coerceDateToJSTimestamp(inDate:number|string|Date|moment.Moment):number {

  let typeofDate = (typeof inDate);

  switch (typeofDate) {

    case "string":
      let parsed = moment(inDate);
      if (!parsed.isValid()) throw new Error(`The supplied date string ${inDate} is invalid.`);
      return parsed.valueOf();
    case "number":
      return <number>inDate;
    default:
      if (inDate instanceof Date) {

        return inDate.getTime();

      }
      else if (inDate instanceof moment && (<moment.Moment>inDate).isValid()) {

        return (<number>inDate).valueOf();

      }
      break;

  }

  throw new Error(`The supplied date ${inDate} is invalid.`);

}

export class DateSchema extends AnySchema {

  public internalJSONSchema:SZDate;

  _timestampType:DateSchemaTimestampType;
  _timestampMode:boolean = false;

  _isoMode:boolean = false;
  _momentMode:boolean = false;

  _min:number;
  _max:number;

  constructor() {

    super(SZSchemaTypes.Date);

    this.internalJSONSchema = new SZDate();

  }

  public valid(...values:Array<Date|string|number>):this {

    const self = this;

    values.forEach((validVal) => {

      if (typeof validVal === "string" || validVal instanceof Date) {

        let pdate = moment(validVal);

        if (pdate.isValid()) {

          self.internalJSONSchema._validValues.push(pdate.valueOf());

        }
        else {

          throw new Error(`Supplied valid value is not a valid date/time string or javascript Date object`);

        }

      }
      else if (typeof validVal === "number") {

        if (validVal >= 0) {

          self.internalJSONSchema._validValues.push(validVal);

        }
        else {

          throw new Error(`Supplied valid value is not a valid javascript timestamp`);

        }

      }
      else {

        throw new Error(`Supplied valid value is not a a valid format`);

      }

    });

    return this;

  }

  public invalid(...values:Array<Date|string|number>):this {

    const self = this;

    values.forEach((invalidVal) => {

      if (typeof invalidVal === "string" || invalidVal instanceof Date) {

        let pdate = moment(invalidVal);

        if (pdate.isValid()) {

          self._invalids.push(pdate.valueOf());

        }
        else {

          throw new Error(`Supplied valid value is not a valid date/time string or javascript Date object`);

        }

      }
      else if (typeof invalidVal === "number") {

        if (invalidVal >= 0) {

          self._invalids.push(invalidVal);

        }
        else {

          throw new Error(`Supplied valid value is not a valid javascript timestamp`);

        }

      }
      else {

        throw new Error(`Supplied valid value is not a a valid format`);

      }

    });

    return this;

  }

  public min(minDate:number|Date|moment.Moment):this {

    this._min = coerceDateToJSTimestamp(minDate);

    return this;

  }

  public max(maxDate:number|string|Date|moment.Moment):this {

    this._max = coerceDateToJSTimestamp(maxDate);

    return this;

  }

  public iso(enableISOMode?:boolean) {

    if (enableISOMode === false) {

      this._isoMode = false;

    }
    else {

      this._isoMode = true;

    }

    return this;

  }

  public moment(enableMomentMode?:boolean):this {

    if (enableMomentMode === false) {

      this._momentMode = false;

    }
    else {

      this._momentMode = true;

    }

    return this;

  }

  public timestamp(type?:DateSchemaTimestampType):this {

    if (!type) type = DEFAULT_TIMESTAMP_TYPE;

    this._timestampType = type;

    this._timestampMode = true;

    this.internalJSONSchema.setTimstamp();

    return this;

  }

  validate(value:string|number|moment.Moment|Date) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate === true) return valStack.value;

    valStack = AnySchema.checkInvalid(this, valStack);

    //check valids

    valStack = AnySchema.checkValid(this, valStack);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

    let ts = -1;

    if (!this._isoMode) {

      if (this._options && this._options.convert !== true) {

        if (this._timestampMode === true && (typeof valStack.value !== "number" || valStack.value < 0)) {

          throw this.generateError("convertRule", `The supplied date is not a valid timestamp. Convert mode is disabled so input must be in this format when timestampMode is enabled.`);

        }
        else if (!this._timestampMode && this._momentMode === true && (!(valStack.value instanceof moment) || !valStack.value.isValid())) {

          throw this.generateError("convertRule", `The supplied date is not a valid moment object. Convert mode is disabled so input must be in this format when momentMode is enabled.`);

        }
        else if (!this._timestampMode && !this._momentMode && !(valStack.value instanceof Date)) {

          throw this.generateError("convertRule", `The supplied date is not a valid javascript date object. Convert mode is disabled so input must be in this format when momentMode and timestampMode are disabled.`);

        }

      }

      ts = coerceDateToJSTimestamp(valStack.value);

    }
    else {

      ts = this._parseISOString(valStack.value);

    }

    if (this._min >= 0 && ts < this._min) {

      throw this.generateError("minRule", `The supplied date is less than the allowed value.`);

    }

    if (this._max >= 0 && ts > this._max) {

      throw this.generateError("maxRule", `The supplied date is more than the allowed value.`);

    }

    if (this._options && this._options.convert !== true) {

      return AnySchema.postValidate(this, valStack.value, value);

    }

    return AnySchema.postValidate(this, this._coerceToDestType(valStack.value), value);

  }

  private _parseISOString(inDate:string):number {

    if (inDate && typeof inDate === "string" && inDate.length > 0) {

      let parsed = moment(inDate, moment.ISO_8601);

      if (parsed.isValid()) {

        return parsed.valueOf();

      }
      else {

        throw new Error(`Supplied date string ${inDate} is not a valid ISO:8601 date formatted date-time.`);

      }

    }
    else {

      throw new Error(`Supplied date is not a valid ISO:8601 date formatted date-time.`);

    }

  }

  private _coerceToDestType(inDate:number|string|Date|moment.Moment):number|string|Date|moment.Moment {

    if (this._options.convert === true) {

      let coercedTS = 0;

      if (typeof inDate === "number") {

        coercedTS = inDate;

      }
      else {

        coercedTS = coerceDateToJSTimestamp(inDate);

      }

      if (this._momentMode === true) {

        return moment(coercedTS);

      }
      else if (this._timestampMode === true) {

        return (this._timestampType === DateSchemaTimestampType.JAVASCRIPT ? coercedTS : Math.floor(coercedTS / 1000));

      }
      else {

        return new Date(coercedTS);

      }

    }

    return inDate;

  }

}


