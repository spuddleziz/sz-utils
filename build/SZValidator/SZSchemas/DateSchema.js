"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
const Date_1 = require("../JSONSchema/Date");
const AnySchema_1 = require("./AnySchema");
const moment = require("moment");
var DateSchemaTimestampType;
(function (DateSchemaTimestampType) {
    DateSchemaTimestampType["JAVASCRIPT"] = "javascript";
    DateSchemaTimestampType["UNIX"] = "unix";
})(DateSchemaTimestampType = exports.DateSchemaTimestampType || (exports.DateSchemaTimestampType = {}));
const DEFAULT_TIMESTAMP_TYPE = DateSchemaTimestampType.JAVASCRIPT;
function coerceDateToJSTimestamp(inDate) {
    let typeofDate = (typeof inDate);
    switch (typeofDate) {
        case "string":
            let parsed = moment(inDate);
            if (!parsed.isValid())
                throw new Error(`The supplied date string ${inDate} is invalid.`);
            return parsed.valueOf();
        case "number":
            return inDate;
        default:
            if (inDate instanceof Date) {
                return inDate.getTime();
            }
            else if (inDate instanceof moment && inDate.isValid()) {
                return inDate.valueOf();
            }
            break;
    }
    throw new Error(`The supplied date ${inDate} is invalid.`);
}
class DateSchema extends AnySchema_1.AnySchema {
    constructor() {
        super(BaseSchema_1.SZSchemaTypes.Date);
        this._timestampMode = false;
        this._isoMode = false;
        this._momentMode = false;
        this.internalJSONSchema = new Date_1.SZDate();
    }
    valid(...values) {
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
    invalid(...values) {
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
    min(minDate) {
        this._min = coerceDateToJSTimestamp(minDate);
        return this;
    }
    max(maxDate) {
        this._max = coerceDateToJSTimestamp(maxDate);
        return this;
    }
    iso(enableISOMode) {
        if (enableISOMode === false) {
            this._isoMode = false;
        }
        else {
            this._isoMode = true;
        }
        return this;
    }
    moment(enableMomentMode) {
        if (enableMomentMode === false) {
            this._momentMode = false;
        }
        else {
            this._momentMode = true;
        }
        return this;
    }
    timestamp(type) {
        if (!type)
            type = DEFAULT_TIMESTAMP_TYPE;
        this._timestampType = type;
        this._timestampMode = true;
        this.internalJSONSchema.setTimstamp();
        return this;
    }
    validate(value) {
        let valStack = AnySchema_1.AnySchema.preValidate(this, value);
        if (valStack.immediate === true)
            return valStack.value;
        valStack = AnySchema_1.AnySchema.checkInvalid(this, valStack);
        //check valids
        valStack = AnySchema_1.AnySchema.checkValid(this, valStack);
        if (valStack.immediate === true)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
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
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        }
        return AnySchema_1.AnySchema.postValidate(this, this._coerceToDestType(valStack.value), value);
    }
    _parseISOString(inDate) {
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
    _coerceToDestType(inDate) {
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
exports.DateSchema = DateSchema;
//# sourceMappingURL=DateSchema.js.map