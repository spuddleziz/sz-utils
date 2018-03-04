"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnySchema_1 = require("./AnySchema");
const assert = require("assert");
const moment = require("moment");
const lodash_1 = require("lodash");
const Types_1 = require("../JSONSchema/Types");
const Builder_1 = require("../Builder");
const SchemaError_1 = require("../SchemaError");
const browser_or_node_1 = require("browser-or-node");
let Buffer = null;
if (browser_or_node_1.isBrowser) {
    Buffer = require('buffer/').Buffer;
}
else if (browser_or_node_1.isNode) {
    Buffer = require('buffer').Buffer;
}
var SZSchemaTypes;
(function (SZSchemaTypes) {
    SZSchemaTypes["Any"] = "AnySchema";
    SZSchemaTypes["Array"] = "ArraySchema";
    SZSchemaTypes["Boolean"] = "BooleanSchema";
    SZSchemaTypes["Binary"] = "BinarySchema";
    SZSchemaTypes["Date"] = "DateSchema";
    SZSchemaTypes["Func"] = "FuncSchema";
    SZSchemaTypes["Number"] = "NumberSchema";
    SZSchemaTypes["Object"] = "ObjectSchema";
    SZSchemaTypes["String"] = "StringSchema";
    SZSchemaTypes["Alternatives"] = "AlternativesSchema";
})(SZSchemaTypes = exports.SZSchemaTypes || (exports.SZSchemaTypes = {}));
function makeCheckValueTypeFunc(schemaType) {
    switch (schemaType) {
        case SZSchemaTypes.Array:
            return function (value) {
                return Array.isArray(value);
            };
        case SZSchemaTypes.Binary:
            return function (value) {
                return (Buffer.isBuffer(value));
            };
        case SZSchemaTypes.Boolean:
            return function (value) {
                return (typeof value === "boolean");
            };
        case SZSchemaTypes.Date:
            return function (value) {
                if (value instanceof Date) {
                    return true;
                }
                else if (typeof value === "number") {
                    return (value >= 0);
                }
                else if (typeof value === "string") {
                    return (moment(value).isValid());
                }
                return false;
            };
        case SZSchemaTypes.Func:
            return function (value) {
                return (typeof value === "function");
            };
        case SZSchemaTypes.Number:
            return function (value) {
                return (typeof value === "number");
            };
        case SZSchemaTypes.Object:
            return function (value) {
                return (typeof value === "object");
            };
        case SZSchemaTypes.String:
            return function (value) {
                return (typeof value == "string");
            };
        case SZSchemaTypes.Any:
        case SZSchemaTypes.Alternatives:
            return function (value) {
                return true;
            };
    }
}
class SchemaWhenCondition {
    constructor(condition, options) {
        if (typeof condition === "string") {
            assert(options.is instanceof AnySchema_1.AnySchema, `When condition is a string, options.is must be set to an instance of Schema`);
            this.is = options.is;
        }
        else {
            assert(condition instanceof AnySchema_1.AnySchema, `When condition is a Schema options.is cannot be specified`);
            this.is = condition;
        }
        assert((options.otherwise instanceof AnySchema_1.AnySchema || options.then instanceof AnySchema_1.AnySchema), `When condition must supply either a then codition or an otherwise condition or both.`);
        if (options.otherwise && options.otherwise instanceof AnySchema_1.AnySchema) {
            this.otherwise = options.otherwise;
        }
        if (options.then && options.then instanceof AnySchema_1.AnySchema) {
            this.then = options.then;
        }
    }
}
exports.SchemaWhenCondition = SchemaWhenCondition;
class BaseSchema {
    constructor(schemaType) {
        this._invalids = [];
        this._rawMode = false;
        this.strictMode = false;
        this._notes = [];
        this._tags = [];
        this.schemaType = schemaType;
        this._checkPassedValueType = makeCheckValueTypeFunc(this.schemaType).bind(this);
        this._options = Builder_1.SZSchemaBuilder.getOptions();
    }
    _checkArrayOfItemsType(typeOfString, values) {
        return (Array.isArray(values) && lodash_1.filter(values, (value) => { return (typeof value === typeOfString); }).length === 0);
    }
    _checkPassedArrayOfValueType(values) {
        return (Array.isArray(values) && lodash_1.filter(values, this._checkPassedValueType).length === values.length);
    }
    _checkPassedValueType(value) {
        return true;
    }
    options(inOptions) {
        this._options = lodash_1.clone(this._options || {});
        lodash_1.assign(this._options, inOptions);
        return this;
    }
    description(description) {
        this.internalJSONSchema.setDescription(description);
        return this;
    }
    label(label) {
        this.internalJSONSchema.setTitle(label);
        return this;
    }
    tags(tags) {
        if (typeof tags === "string") {
            this._tags.push(tags);
            return this;
        }
        else if (this._checkArrayOfItemsType("string", tags)) {
            this._tags.push.apply(this._tags, tags);
            return this;
        }
        throw new Error(`Supplied tags must be a string or array of strings`);
    }
    meta(value) {
        if (value !== null && value !== undefined) {
            this._meta = lodash_1.clone(value);
            return this;
        }
        this._meta = null;
        return this;
    }
    notes(notes) {
        if (typeof notes === "string") {
            this._notes.push(notes);
            return this;
        }
        else if (this._checkArrayOfItemsType("string", notes)) {
            this._notes.push.apply(this._notes, notes);
            return this;
        }
        throw new Error(`Supplied notes must be a string or array of strings`);
    }
    concat(inSchema) {
        assert(inSchema.schemaType === this.schemaType, `Supplied Schema to concatenate with this schema is not of the same type. ${this.schemaType}`);
        const copySchemaKeys = [
            "_tags",
            "_meta",
            "_unit",
            "_notes"
        ];
        if (inSchema.strictMode === true) {
            this.strict();
        }
        if (inSchema._emptyValue && !inSchema._emptySchema && !(inSchema._emptySchema instanceof AnySchema_1.AnySchema)) {
            this.empty(inSchema._emptyValue);
        }
        else if (inSchema._emptySchema instanceof AnySchema_1.AnySchema) {
            this.empty(inSchema._emptySchema);
        }
        if (inSchema._whenConditions.length > 0) {
            this._whenConditions.push.apply(this._whenConditions, inSchema._whenConditions);
        }
        if (inSchema._rawMode === true) {
            this.raw();
        }
        if (Array.isArray(inSchema._invalids) && inSchema._invalids.length > 0) {
            this._invalids.push.apply(this._invalids, inSchema._invalids);
        }
        copySchemaKeys.forEach((keyToCopy) => {
            switch (keyToCopy) {
                case "_tags":
                case "_notes":
                    if (!inSchema.hasOwnProperty(keyToCopy) || !Array.isArray(inSchema[keyToCopy]) || inSchema[keyToCopy].length === 0)
                        return;
                    this[keyToCopy].push.apply(this[keyToCopy], inSchema[keyToCopy]);
                    return;
                default:
                    if (!inSchema.hasOwnProperty(keyToCopy) || inSchema[keyToCopy] === undefined || inSchema[keyToCopy] === null)
                        return;
                    this[keyToCopy] = inSchema[keyToCopy];
                    return;
            }
        });
        //now merge the internal JSON schema
        if (inSchema.internalJSONSchema.example && this._checkPassedValueType(inSchema.internalJSONSchema.example)) {
            this.internalJSONSchema.setExamples(inSchema.internalJSONSchema.example);
        }
        else if (inSchema.internalJSONSchema.examples && inSchema.internalJSONSchema.examples.length > 0 && this._checkPassedArrayOfValueType(inSchema.internalJSONSchema.examples)) {
            this.internalJSONSchema.setExamples(inSchema.internalJSONSchema.examples);
        }
        if (inSchema.internalJSONSchema._validValues && inSchema.internalJSONSchema._validValues.length > 0) {
            this.internalJSONSchema.setValids(inSchema.internalJSONSchema._validValues);
        }
        if (inSchema.internalJSONSchema.default !== null && inSchema.internalJSONSchema.default !== undefined && this._checkPassedValueType(inSchema.internalJSONSchema.default)) {
            this.default(inSchema.internalJSONSchema.default);
        }
        if (inSchema.internalJSONSchema._requiredFlag === true) {
            this.required();
        }
        else {
            this.optional();
        }
        if (inSchema.internalJSONSchema._forbiddenFlag === true) {
            this.forbidden(true);
        }
        else {
            this.forbidden(false);
        }
        if (inSchema.internalJSONSchema._stripFlag === true) {
            this.strip(true);
        }
        else if (this.internalJSONSchema._stripFlag !== true) {
            this.strip(false);
        }
        const internalSchemaKeysToCopy = [
            "title",
            "description"
        ];
        let jsSchemaType = inSchema.internalJSONSchema._type;
        if (!Array.isArray(jsSchemaType) && jsSchemaType !== null && jsSchemaType !== undefined) {
            switch (jsSchemaType) {
                case Types_1.Types.array:
                    internalSchemaKeysToCopy.push.apply(internalSchemaKeysToCopy, ["uniqueItems", "minItems", "maxItems"]);
                    this.internalJSONSchema._items = inSchema.internalJSONSchema._items;
                    break;
                case Types_1.Types.integer:
                case Types_1.Types.number:
                    internalSchemaKeysToCopy.push.apply(internalSchemaKeysToCopy, ["minimum", "exclusiveMinimum", "maximum", "exclusiveMaximum"]);
                    break;
                case Types_1.Types.string:
                    internalSchemaKeysToCopy.push.apply(internalSchemaKeysToCopy, ["pattern", "minLength", "maxLength", "format"]);
                    break;
                case Types_1.Types.object:
                    //additionalProperties
                    internalSchemaKeysToCopy.push("additionalProperties");
                    if (Array.isArray(inSchema.internalJSONSchema._required) && inSchema.internalJSONSchema._required.length > 0) {
                        if (!Array.isArray(this.internalJSONSchema._required)) {
                            this.internalJSONSchema._required = inSchema.internalJSONSchema._required;
                        }
                    }
                    if (inSchema.internalJSONSchema._properties && typeof inSchema.internalJSONSchema._properties === "object" &&
                        Object.keys(inSchema.internalJSONSchema._properties).length > 0) {
                        if (!this.internalJSONSchema._properties)
                            this.internalJSONSchema._properties = {};
                        for (let propKey in inSchema.internalJSONSchema._properties) {
                            if (inSchema.internalJSONSchema._properties.hasOwnProperty(propKey) &&
                                inSchema.internalJSONSchema._properties[propKey] !== undefined &&
                                inSchema.internalJSONSchema._properties[propKey] !== null) {
                                this.internalJSONSchema._properties[propKey] = inSchema.internalJSONSchema._properties[propKey];
                            }
                        }
                    }
                    if (inSchema.internalJSONSchema._keyPattern && inSchema.internalJSONSchema._keyPattern.rule && inSchema.internalJSONSchema._keyPattern.regex) {
                        this.internalJSONSchema.setKeyPattern(inSchema.internalJSONSchema._keyPattern.regex, inSchema.internalJSONSchema._keyPattern.rule);
                    }
                    break;
                case Types_1.Types.null:
                case Types_1.Types.boolean:
                default:
                    break;
            }
        }
        internalSchemaKeysToCopy.forEach((internalSchemaKey) => {
            if (inSchema.internalJSONSchema.hasOwnProperty(internalSchemaKey) &&
                inSchema.internalJSONSchema[internalSchemaKey] !== null &&
                inSchema.internalJSONSchema[internalSchemaKey] !== undefined) {
                this.internalJSONSchema[internalSchemaKey] = inSchema.internalJSONSchema[internalSchemaKey];
            }
        });
        return this;
    }
    when(condition, options) {
        this._whenConditions.push(new SchemaWhenCondition(condition, options));
        return this;
    }
    strict(setStrict) {
        if (setStrict === false) {
            this.strictMode = false;
        }
        this.strictMode = true;
        return this;
    }
    raw(rawEnabled) {
        if (rawEnabled === false) {
            this._rawMode = false;
        }
        else {
            this._rawMode = true;
        }
        return this;
    }
    strip(stripEnabled) {
        if (stripEnabled === false) {
            this.internalJSONSchema.setStrip(false);
        }
        else {
            this.internalJSONSchema.setStrip(true);
        }
        return this;
    }
    forbidden(forbiddenEnabled) {
        if (forbiddenEnabled === false) {
            this.internalJSONSchema.setForbidden(false);
        }
        else {
            this.internalJSONSchema.setForbidden(true);
        }
        return this;
    }
    required() {
        this.internalJSONSchema.setRequired(true);
        return this;
    }
    exist() {
        return this.required();
    }
    optional() {
        this.internalJSONSchema.setRequired(false);
        return this;
    }
    empty(value) {
        if (value instanceof AnySchema_1.AnySchema) {
            this._emptySchema = value;
        }
        else if (value === undefined) {
            this._emptySchema = null;
            this._emptyValue = null;
        }
        else {
            assert(this._checkPassedValueType(value), `Empty Value supplied must be of the same type as the Schema: ${this.schemaType}`);
            this._emptyValue = value;
        }
        return this;
    }
    default(value) {
        assert(this._checkPassedValueType(value), `Supplied Value must be of the same type as the Schema: ${this.schemaType}`);
        this.internalJSONSchema.setDefault(value);
        return this;
    }
    valid(...values) {
        if (this._checkPassedArrayOfValueType(values)) {
            this.internalJSONSchema._validValues.push.apply(this.internalJSONSchema._validValues, values);
            return this;
        }
        else if (this._checkPassedArrayOfValueType(values[0])) {
            this.internalJSONSchema._validValues.push.apply(this.internalJSONSchema._validValues, values[0]);
            return this;
        }
        else if (this._checkPassedValueType(values[0])) {
            this.internalJSONSchema._validValues.push(values[0]);
            return this;
        }
        throw new Error(`Values passed are not of the same type as the Schema: ${this.schemaType}`);
    }
    allow(...values) {
        return this.valid.apply(this, values);
    }
    allowNull() {
        if (this.internalJSONSchema._validValues.indexOf(null) >= 0)
            return this;
        this.internalJSONSchema._validValues.push(null);
        return this;
    }
    only(...values) {
        return this.valid.apply(this, values);
    }
    equal(...values) {
        return this.valid.apply(this, values);
    }
    invalid(...values) {
        if (this._checkPassedArrayOfValueType(values)) {
            this._invalids.push.apply(this._invalids, values);
            return this;
        }
        else if (this._checkPassedArrayOfValueType(values[0])) {
            this._invalids.push.apply(this._invalids, values[0]);
            return this;
        }
        else if (this._checkPassedValueType(values[0])) {
            this._invalids.push(values[0]);
            return this;
        }
        throw new Error(`Invalid values passed are not of the same type as the Schema: ${this.schemaType}`);
    }
    disallow(...values) {
        return this.invalid.apply(this, values);
    }
    not(...values) {
        return this.invalid.apply(this, values);
    }
    example(...examples) {
        if (this.schemaType === SZSchemaTypes.Array && examples.length === 1 && Array.isArray(examples[0])) {
            examples = [examples[0]];
            this.internalJSONSchema.setExamples(examples);
            return this;
        }
        if (this.schemaType !== SZSchemaTypes.Array && Array.isArray(examples) && this._checkPassedArrayOfValueType(examples)) {
            this.internalJSONSchema.setExamples(examples);
            return this;
        }
        return this;
    }
    error(err) {
        if (typeof err === "function") {
            this._customErrorFunc = err;
            this._customError = null;
        }
        else if (err instanceof Error) {
            this._customError = err;
            this._customErrorFunc = null;
        }
        else {
            this._customErrorFunc = null;
            this._customError = null;
        }
        return this;
    }
    generateError(rule, message) {
        return new SchemaError_1.SchemaValidationFailedError(`Rule [${this.schemaType}.${rule}] validation has failed: ${message}`);
    }
    getJSONSchema() {
        return this.internalJSONSchema.toJSON();
    }
    //during validation phase we need to understand is we are an object or not - manage references etc and follow
    validate(value) {
        return value;
    }
    static checkValid(schema, valStack) {
        const validLen = (Array.isArray(schema.internalJSONSchema._validValues) ? schema.internalJSONSchema._validValues.length : 0);
        if (validLen > 0) {
            switch (schema.schemaType) {
                case SZSchemaTypes.Alternatives:
                case SZSchemaTypes.Func:
                    return valStack;
                case SZSchemaTypes.String:
                    if (schema._insensitiveMode === true) {
                        const valLower = valStack.value.toLowerCase();
                        if (lodash_1.filter(schema.internalJSONSchema._validValues, (validVal) => { return validVal.toLowerCase() === valLower; }).length > 0) {
                            valStack.immediate = true;
                            return valStack;
                        }
                    }
                    else {
                        if (schema.internalJSONSchema._validValues.indexOf(valStack.value) >= 0) {
                            valStack.immediate = true;
                            return valStack;
                        }
                    }
                    return valStack;
                case SZSchemaTypes.Boolean:
                    if (typeof valStack.value !== "boolean" && schema._falseyVals.length > 0 || schema._truthyVals.length > 0) {
                        return valStack;
                    }
                    else if (schema.internalJSONSchema._validValues.indexOf(valStack.value) >= 0) {
                        valStack.immediate = true;
                        return valStack;
                    }
                    return valStack;
                case SZSchemaTypes.Array:
                case SZSchemaTypes.Object:
                case SZSchemaTypes.Any:
                    for (let validItemIndex = 0; validItemIndex < validLen; validItemIndex++) {
                        if (lodash_1.isEqual(valStack.value, schema.internalJSONSchema._validValues[validItemIndex])) {
                            valStack.immediate = true;
                            return valStack;
                        }
                    }
                    return valStack;
                case SZSchemaTypes.Number:
                case SZSchemaTypes.Date:
                    if (schema._invalids.indexOf(valStack.value) >= 0) {
                        valStack.immediate = true;
                        return valStack;
                    }
                    return valStack;
                case SZSchemaTypes.Binary:
                    for (let validItemIndex = 0; validItemIndex < validLen; validItemIndex++) {
                        if (valStack.value.length === schema.internalJSONSchema._validValues[validItemIndex].length && Buffer.compare(schema.internalJSONSchema._validValues[validItemIndex], valStack.value)) {
                            valStack.immediate = true;
                            return valStack;
                        }
                    }
                    return valStack;
            }
        }
        else
            return valStack;
    }
    static checkInvalid(schema, valStack) {
        const invalidLen = (Array.isArray(schema._invalids) ? schema._invalids.length : 0);
        if (invalidLen > 0) {
            switch (schema.schemaType) {
                case SZSchemaTypes.Alternatives:
                case SZSchemaTypes.Func:
                    return valStack;
                case SZSchemaTypes.String:
                    if (schema._insensitiveMode === true) {
                        const valLower = valStack.value.toLowerCase();
                        if (lodash_1.filter(schema._invalids, (invalidVal) => { return invalidVal.toLowerCase() === valLower; }).length > 0) {
                            throw schema.generateError("invalid", `Value supplied is in the invalid list.`);
                        }
                    }
                    else {
                        if (schema._invalids.indexOf(valStack.value) >= 0) {
                            throw schema.generateError("invalid", `Value supplied is in the invalid list.`);
                        }
                    }
                    return valStack;
                case SZSchemaTypes.Boolean:
                    if (typeof valStack.value !== "boolean" && schema._falseyVals.length > 0 || schema._truthyVals.length > 0) {
                        return valStack;
                    }
                    else if (schema._invalids.indexOf(valStack.value) >= 0) {
                        throw schema.generateError("invalid", `Value supplied is in the invalid list.`);
                    }
                    return valStack;
                case SZSchemaTypes.Array:
                case SZSchemaTypes.Object:
                case SZSchemaTypes.Any:
                    for (let invalidItemIndex = 0; invalidItemIndex < invalidLen; invalidItemIndex++) {
                        if (lodash_1.isEqual(valStack.value, schema._invalids[invalidItemIndex])) {
                            throw schema.generateError("invalid", `Value supplied is in the invalid list.`);
                        }
                    }
                    return valStack;
                case SZSchemaTypes.Number:
                case SZSchemaTypes.Date:
                    if (schema._invalids.indexOf(valStack.value) >= 0) {
                        throw schema.generateError("invalid", `Value supplied is in the invalid list.`);
                    }
                    return valStack;
                case SZSchemaTypes.Binary:
                    for (let invalidItemIndex = 0; invalidItemIndex < invalidLen; invalidItemIndex++) {
                        if (valStack.value.length === schema._invalids[invalidItemIndex].length && Buffer.compare(schema._invalids[invalidItemIndex], valStack.value)) {
                            throw schema.generateError("invalid", `Value supplied is in the invalid list.`);
                        }
                    }
                    return valStack;
            }
        }
        else
            return valStack;
    }
    static preValidate(schema, value) {
        let retVal = {
            value: null,
            immediate: false
        };
        if (schema.internalJSONSchema._requiredFlag === true &&
            ((value === undefined && schema.internalJSONSchema._validValues.indexOf(undefined) === -1) ||
                (value == null && schema.internalJSONSchema._validValues.indexOf(null) === -1))) {
            throw schema.generateError("required", `Value passed is invalid because a value is required and the value isn't in the valid values list.`);
        }
        else if (schema.internalJSONSchema._forbiddenFlag === true) {
            throw schema.generateError("forbidden", `Value passed is invalid because a value is forbidden for this schema.`);
        }
        else if (!schema.internalJSONSchema._requiredFlag && (value === undefined || value === null)) {
            retVal.value = undefined;
            retVal.immediate = true;
        }
        else if (schema._emptySchema && schema._emptySchema instanceof AnySchema_1.AnySchema) {
            try {
                schema._emptySchema.validate(value);
                //essentially if an exception was not thrown the value is coerced to undefinned and we set immediate...
                retVal.value = undefined;
                retVal.immediate = true;
            }
            catch (ex) {
                //when an empty value doesn't match we need to fall through so the main validator can validate the value!
                retVal.value = value;
            }
        }
        else if (schema._emptyValue && typeof schema._emptyValue === typeof value && lodash_1.isEqual(value, schema._emptyValue)) {
            retVal.value = undefined;
            retVal.immediate = true;
        }
        else if ((value === null || value === undefined) && schema.internalJSONSchema.default !== null && schema.internalJSONSchema.default !== undefined) {
            retVal.value = lodash_1.clone(schema.internalJSONSchema.default);
            retVal.immediate = true;
        }
        else {
            retVal.value = value;
        }
        return retVal;
    }
    static postValidate(schema, validatedValue, rawValue) {
        if (schema.internalJSONSchema._stripFlag === true) {
            return undefined;
        }
        else if (schema._rawMode === true) {
            return rawValue;
        }
        return validatedValue;
    }
}
exports.BaseSchema = BaseSchema;
//# sourceMappingURL=BaseSchema.js.map