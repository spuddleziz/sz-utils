import {AnySchema} from "./AnySchema";
import * as Promise from "bluebird";
import * as assert from "assert";
import * as moment from "moment";
import {Schema} from "../JSONSchema/Schema";
import {filter, clone, assign, isEqual} from "lodash";
import {Types} from "../JSONSchema/Types";
import {SZArray} from "../JSONSchema/Array";
import {ISZSchemaBuilderOptions, SZSchemaBuilder} from "../Builder";
import {SchemaValidationFailedError} from "../SchemaError";
import {StringSchema} from "./StringSchema";
import {BooleanSchema} from "./BooleanSchema";
import {DateSchema} from "./DateSchema";
import { isBrowser, isNode } from 'browser-or-node';
let Buffer = null;
if (isBrowser) {

  Buffer = require('buffer/').Buffer;

}
else if (isNode) {

  Buffer = require('buffer').Buffer;

}

export enum SZSchemaTypes {

  Any = "AnySchema",
  Array = "ArraySchema",
  Boolean = "BooleanSchema",
  Binary = "BinarySchema",
  Date = "DateSchema",
  Func = "FuncSchema",
  Number = "NumberSchema",
  Object = "ObjectSchema",
  String = "StringSchema",
  Alternatives = "AlternativesSchema"

}

function makeCheckValueTypeFunc<T>(schemaType:SZSchemaTypes):Function {

  switch (schemaType) {

    case SZSchemaTypes.Array:
      return function (value:Array<any>) {

        return Array.isArray(value);

      };
    case SZSchemaTypes.Binary:
      return function (value:Buffer) {

        return (Buffer.isBuffer(value));

      };
    case SZSchemaTypes.Boolean:
      return function (value:boolean) {

        return (typeof value === "boolean");

      };
    case SZSchemaTypes.Date:
      return function (value:Date | number | string) {

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
      return function (value:Function) {

        return (typeof value === "function");

      };
    case SZSchemaTypes.Number:
      return function (value:number) {

        return (typeof value === "number");

      };
    case SZSchemaTypes.Object:
      return function (value:object) {

        return (typeof value === "object");

      };
    case SZSchemaTypes.String:
      return function (value:string) {

        return (typeof value == "string");

      };
    case SZSchemaTypes.Any:
    case SZSchemaTypes.Alternatives:
      return function (value:any) {
        return true;
      }

  }

}

export interface SchemaWhenConditionOptions {

  is?:AnySchema,
  then?:AnySchema,
  otherwise?:AnySchema;

}

export class SchemaWhenCondition {

  conditionKey:string;

  is:AnySchema;
  then:AnySchema;
  otherwise:AnySchema;

  constructor(condition:string|AnySchema, options:SchemaWhenConditionOptions) {

    if (typeof condition === "string") {

      assert(options.is instanceof AnySchema, `When condition is a string, options.is must be set to an instance of Schema`);

      this.is = options.is;



    }
    else {

      assert(condition instanceof AnySchema, `When condition is a Schema options.is cannot be specified`);

      this.is = condition;

    }

    assert((options.otherwise instanceof AnySchema || options.then instanceof AnySchema), `When condition must supply either a then codition or an otherwise condition or both.`);

    if (options.otherwise && options.otherwise instanceof AnySchema) {

      this.otherwise = options.otherwise;

    }

    if (options.then && options.then instanceof AnySchema) {

      this.then = options.then;

    }

  }

}


export class BaseSchema<T> {

  protected _buildJSONSchema:object;
  protected _compiledSchema:any;
  public internalJSONSchema:Schema<T>;
  protected _invalids:Array<T> = [];
  protected _whenConditions:Array<SchemaWhenCondition>;
  protected _rawMode:boolean = false;
  protected _emptySchema:AnySchema;
  protected _emptyValue:T;
  protected _customError:Error;
  protected _customErrorFunc:Function;

  public schemaType:SZSchemaTypes;

  public strictMode:boolean = false;
  protected _unit:string;
  protected _meta:any;
  protected _notes:Array<string> = [];
  protected _tags:Array<string> = [];
  protected _options:ISZSchemaBuilderOptions;

  constructor(schemaType:SZSchemaTypes) {

    this.schemaType = schemaType;

    this._checkPassedValueType = makeCheckValueTypeFunc(this.schemaType).bind(this);

    this._options = SZSchemaBuilder.getOptions();

  }

  protected _checkArrayOfItemsType(typeOfString, values) {

    return (Array.isArray(values) && filter(values, (value) => { return (typeof value === typeOfString); }).length === 0);

  }

  protected _checkPassedArrayOfValueType(values:Array<T>) {

    return (Array.isArray(values) && filter(values, this._checkPassedValueType).length === values.length);

  }

  protected _checkPassedValueType(value:T) {

    return true;

  }

  public options(inOptions:ISZSchemaBuilderOptions):this {

    this._options = clone(this._options || {});

    assign(this._options, inOptions);

    return this;

  }

  public description(description:string):this {

    this.internalJSONSchema.setDescription(description);

    return this;

  }

  public label(label:string):this {

    this.internalJSONSchema.setTitle(label);

    return this;

  }

  public tags(tag:string):this
  public tags(tags:Array<string>):this
  public tags(tags:Array<string>|string):this {

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

  public meta(value:any):this {

    if (value !== null && value !== undefined) {

      this._meta = clone(value);

      return this;

    }

    this._meta = null;

    return this;

  }

  public notes(notes:string):this
  public notes(notes:Array<string>):this
  public notes(notes:Array<string>|string) :this{

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

  public concat(inSchema:AnySchema):this {

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

    if (inSchema._emptyValue && !inSchema._emptySchema && !(inSchema._emptySchema instanceof AnySchema)) {

      this.empty(inSchema._emptyValue);

    }
    else if (inSchema._emptySchema instanceof AnySchema) {

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
          if (!inSchema.hasOwnProperty(keyToCopy) || !Array.isArray(inSchema[keyToCopy]) || inSchema[keyToCopy].length === 0) return;
          this[keyToCopy].push.apply(this[keyToCopy], inSchema[keyToCopy]);
          return;
        default:
          if (!inSchema.hasOwnProperty(keyToCopy) || inSchema[keyToCopy] === undefined || inSchema[keyToCopy] === null) return;
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

        case Types.array:
          internalSchemaKeysToCopy.push.apply(internalSchemaKeysToCopy, ["uniqueItems", "minItems", "maxItems"]);
          (<any>this.internalJSONSchema)._items = (<any>inSchema.internalJSONSchema)._items;
          break;
        case Types.integer:
        case Types.number:
          internalSchemaKeysToCopy.push.apply(internalSchemaKeysToCopy, ["minimum", "exclusiveMinimum", "maximum", "exclusiveMaximum"]);
          break;
        case Types.string:
          internalSchemaKeysToCopy.push.apply(internalSchemaKeysToCopy, ["pattern", "minLength", "maxLength", "format"]);
          break;
        case Types.object:
          //additionalProperties
          internalSchemaKeysToCopy.push("additionalProperties");
          if (Array.isArray((<any>inSchema.internalJSONSchema)._required) && (<any>inSchema.internalJSONSchema)._required.length > 0) {

            if (!Array.isArray((<any>this.internalJSONSchema)._required)) {

              (<any>this.internalJSONSchema)._required = (<any>inSchema.internalJSONSchema)._required;

            }

          }

          if ((<any>inSchema.internalJSONSchema)._properties && typeof (<any>inSchema.internalJSONSchema)._properties === "object" &&
            Object.keys((<any>inSchema.internalJSONSchema)._properties).length > 0) {

            if (!(<any>this.internalJSONSchema)._properties) (<any>this.internalJSONSchema)._properties = {};

            for (let propKey in (<any>inSchema.internalJSONSchema)._properties) {

              if ((<any>inSchema.internalJSONSchema)._properties.hasOwnProperty(propKey) &&
                (<any>inSchema.internalJSONSchema)._properties[propKey] !== undefined &&
                (<any>inSchema.internalJSONSchema)._properties[propKey] !== null) {

                (<any>this.internalJSONSchema)._properties[propKey] = (<any>inSchema.internalJSONSchema)._properties[propKey];

              }

            }

          }

          if ((<any>inSchema.internalJSONSchema)._keyPattern && (<any>inSchema.internalJSONSchema)._keyPattern.rule && (<any>inSchema.internalJSONSchema)._keyPattern.regex) {

            (<any>this.internalJSONSchema).setKeyPattern((<any>inSchema.internalJSONSchema)._keyPattern.regex, (<any>inSchema.internalJSONSchema)._keyPattern.rule);

          }
          break;
        case Types.null:
        case Types.boolean:
        default:
          break;


      }

    }

    internalSchemaKeysToCopy.forEach((internalSchemaKey) => {

      if ((<any>inSchema.internalJSONSchema).hasOwnProperty(internalSchemaKey) &&
        (<any>inSchema.internalJSONSchema)[internalSchemaKey] !== null &&
        (<any>inSchema.internalJSONSchema)[internalSchemaKey] !== undefined) {

        (<any>this.internalJSONSchema)[internalSchemaKey] = (<any>inSchema.internalJSONSchema)[internalSchemaKey];

      }

    });

    return this;

  }

  public when(condition:string|AnySchema, options:SchemaWhenConditionOptions):this {

    this._whenConditions.push(new SchemaWhenCondition(condition, options));

    return this;

  }

  public strict(setStrict?:boolean):this {

    if (setStrict === false) {

      this.strictMode = false;

    }

    this.strictMode = true;

    return this;

  }

  public raw(rawEnabled?:boolean):this {

    if (rawEnabled === false) {

      this._rawMode = false;

    }
    else {

      this._rawMode = true;

    }

    return this;

  }

  public strip(stripEnabled?:boolean):this {

    if (stripEnabled === false) {

      this.internalJSONSchema.setStrip(false);

    }
    else {

      this.internalJSONSchema.setStrip(true);

    }

    return this;

  }

  public forbidden(forbiddenEnabled?:boolean):this {

    if (forbiddenEnabled === false) {

      this.internalJSONSchema.setForbidden(false);

    }
    else {

      this.internalJSONSchema.setForbidden(true);

    }

    return this;

  }

  public required():this {

    this.internalJSONSchema.setRequired(true);

    return this;

  }

  public exist():this {

    return this.required();

  }

  public optional():this {

    this.internalJSONSchema.setRequired(false);

    return this;

  }

  public empty(value?:AnySchema|T):this {

    if (value instanceof AnySchema) {

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

  public default(value:T):this {

    assert(this._checkPassedValueType(value), `Supplied Value must be of the same type as the Schema: ${this.schemaType}`);

    this.internalJSONSchema.setDefault(value);

    return this;

  }

  public valid(...values:Array<T>):this {

    if (this._checkPassedArrayOfValueType(values)) {

      this.internalJSONSchema._validValues.push.apply(this.internalJSONSchema._validValues, values);

      return this;

    }
    else if (this._checkPassedArrayOfValueType((<any>values[0]))) {

      this.internalJSONSchema._validValues.push.apply(this.internalJSONSchema._validValues, values[0]);

      return this;

    }
    else if (this._checkPassedValueType(values[0])) {

      this.internalJSONSchema._validValues.push(values[0]);

      return this;

    }

    throw new Error(`Values passed are not of the same type as the Schema: ${this.schemaType}`);

  }

  public allow(...values:Array<T>):this {

    return this.valid.apply(this, values);

  }

  public allowNull():this {

    if (this.internalJSONSchema._validValues.indexOf(null) >= 0) return this;

    this.internalJSONSchema._validValues.push(null);

    return this;

  }

  public only(...values:Array<T>):this {

    return this.valid.apply(this, values);

  }

  public equal(...values:Array<T>):this {

    return this.valid.apply(this, values);

  }

  public invalid(...values:Array<T>):this {

    if (this._checkPassedArrayOfValueType(values)) {

      this._invalids.push.apply(this._invalids, values);

      return this;

    }
    else if (this._checkPassedArrayOfValueType((<any>values[0]))) {

      this._invalids.push.apply(this._invalids, values[0]);

      return this;

    }
    else if (this._checkPassedValueType(values[0])) {

      this._invalids.push(values[0]);

      return this;

    }

    throw new Error(`Invalid values passed are not of the same type as the Schema: ${this.schemaType}`);

  }

  public disallow(...values:Array<T>):this {

    return this.invalid.apply(this, values);

  }

  public not(...values:Array<T>):this {

    return this.invalid.apply(this, values);

  }

  public example(...examples:Array<T>):this {

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

  error(err:Error|Function):this {

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

  protected generateError(rule:string, message:string) {

    return new SchemaValidationFailedError(`Rule [${this.schemaType}.${rule}] validation has failed: ${message}`);

  }

  public getJSONSchema() {

    return this.internalJSONSchema.toJSON();

  }


  //during validation phase we need to understand is we are an object or not - manage references etc and follow


  public validate(value) {

    return value;

  }

  public static checkValid(schema:AnySchema, valStack:{value:any, immediate:boolean}):{value:any, immediate:boolean} {

    const validLen = (Array.isArray(schema.internalJSONSchema._validValues) ? schema.internalJSONSchema._validValues.length : 0);

    if (validLen > 0) {

      switch (schema.schemaType) {

        case SZSchemaTypes.Alternatives:
        case SZSchemaTypes.Func:
          return valStack;
        case SZSchemaTypes.String:
          if ((<StringSchema>schema)._insensitiveMode === true) {

            const valLower = valStack.value.toLowerCase();

            if (filter(schema.internalJSONSchema._validValues, (validVal) => { return validVal.toLowerCase() === valLower }).length > 0) {

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
          if (typeof valStack.value !== "boolean" && (<BooleanSchema>schema)._falseyVals.length > 0 || (<BooleanSchema>schema)._truthyVals.length > 0) {

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

            if (isEqual(valStack.value, schema.internalJSONSchema._validValues[validItemIndex])) {

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
    else return valStack;

  }

  public static checkInvalid(schema:AnySchema, valStack:{value:any, immediate:boolean}):{value:any, immediate:boolean} {

    const invalidLen = (Array.isArray(schema._invalids) ? schema._invalids.length : 0);

    if (invalidLen > 0) {

      switch (schema.schemaType) {

        case SZSchemaTypes.Alternatives:
        case SZSchemaTypes.Func:
          return valStack;
        case SZSchemaTypes.String:
          if ((<StringSchema>schema)._insensitiveMode === true) {

            const valLower = valStack.value.toLowerCase();

            if (filter(schema._invalids, (invalidVal) => { return invalidVal.toLowerCase() === valLower }).length > 0) {

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
          if (typeof valStack.value !== "boolean" && (<BooleanSchema>schema)._falseyVals.length > 0 || (<BooleanSchema>schema)._truthyVals.length > 0) {

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

            if (isEqual(valStack.value, schema._invalids[invalidItemIndex])) {

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
    else return valStack;

  }

  public static preValidate(schema:AnySchema, value:any) {

    let retVal = {

      value : null,
      immediate : false

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
    else if (schema._emptySchema && schema._emptySchema instanceof AnySchema) {

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
    else if (schema._emptyValue && typeof schema._emptyValue === typeof value && isEqual(value, schema._emptyValue)) {

      retVal.value = undefined;
      retVal.immediate = true;

    }
    else if ((value === null || value === undefined) && schema.internalJSONSchema.default !== null && schema.internalJSONSchema.default !== undefined) {

      retVal.value = clone(schema.internalJSONSchema.default);
      retVal.immediate = true;

    }
    else {

      retVal.value = value;

    }

    return retVal;

  }

  public static postValidate(schema:AnySchema, validatedValue:any, rawValue:any) {

    if (schema.internalJSONSchema._stripFlag === true) {

      return undefined;

    }
    else if (schema._rawMode === true) {

      return rawValue;

    }

    return validatedValue;

  }

}
