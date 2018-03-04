import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZArray} from "../JSONSchema/Array";
import {SZAny} from "../JSONSchema/Any";
import {SchemaValidationErrors, SchemaValidationFailedError} from "../SchemaError";
import {AnySchema} from "./AnySchema";
import {SZObject} from "../JSONSchema/Object";
import {IDictionary} from "../../IDictionary";
import {map, filter, assign, pull, without, clone, find} from "lodash";
import * as assert from "assert";
import {Constructor} from "make-error";
import {SZValidatorUtils} from "../Utils";
import * as dot from "dot-object";

export interface ObjectSchemaRenameRuleOptions {

  alias?:boolean;
  multiple?:boolean;
  override?:boolean;
  ignoreUndefined?:boolean;
  setUndefinedOnFromKey?:boolean;

}

const DEFAULT_RENAME_RULE_OPTIONS:ObjectSchemaRenameRuleOptions = {

  alias : false,
  multiple : false,
  override : false,
  ignoreUndefined : false,
  setUndefinedOnFromKey: false

};

const ChildKeyRegex:RegExp = /^[A-Za-z0-9]+[A-Z0-9a-z_]+[A-Z0-9a-z]+(\.[A-Za-z0-9]+[A-Z0-9a-z_]+[A-Z0-9a-z]+)+$/;


export class ObjectSchemaRenameRule {

  options:ObjectSchemaRenameRuleOptions;
  from:string;
  to:string;
  optionsEnabled:boolean = false;

  constructor(from:string, to:string, options?:ObjectSchemaRenameRuleOptions) {

    assert((typeof from === "string" && from.length > 0 && typeof to === "string" && to.length > 0), `Must supply both a to and a from argument as a string.`);

    this.options = clone(DEFAULT_RENAME_RULE_OPTIONS);

    if (options && Object.keys(options).length > 0) {

      for (let key in options) {

        if (options.hasOwnProperty(key) && options[key] === true) {

          this.optionsEnabled = true;

          this.options[key] = true;

        }

      }

    }

    this.to = to;
    this.from = from;

  }

}

export interface ObjectSchemaAssertionRule {

  schema?:AnySchema;
  ref?:string;
  message?:string;

}

export class ObjectSchema extends AnySchema {

  public internalJSONSchema:SZObject;

  _anyKey:boolean = true;
  _anyKeySchema:AnySchema = new AnySchema();

  _keyPattern:RegExp;
  _keyPatternSchema:AnySchema;

  _properties:IDictionary<AnySchema> = {};

  _minKeys:number;
  _maxKeys:number;

  _andRulesMap:IDictionary<Array<string>> = {};
  _nandRulesMap:IDictionary<Array<string>> = {};
  _orRulesMap:IDictionary<Array<string>> = {};
  _xorRulesMap:IDictionary<Array<string>> = {};
  _withRules:IDictionary<Array<string>> = {};
  _withoutRules:IDictionary<Array<string>> = {};
  _renameRules:IDictionary<ObjectSchemaRenameRule> = {};
  _assertRules:IDictionary<Array<ObjectSchemaAssertionRule>> = {};

  _constructorType:Function;
  _constructorTypeName:string;

  _isMetaSchema:boolean = false;

  _forbiddenKeys:Array<string> = [];
  _requiredKeys:Array<string> = [];
  _optionalKeys:Array<string> = [];

  constructor(inSchemaMap?:IDictionary<AnySchema>) {

    super(SZSchemaTypes.Object);

    this.internalJSONSchema = new SZObject();

    if (inSchemaMap && typeof inSchemaMap === "object") {

      this.keys(inSchemaMap);

    }

  }

  keys(inSchemaMap:IDictionary<AnySchema>):this {

    if (inSchemaMap === undefined || inSchemaMap === null) {

      this._anyKey = true;

      //allow any key

    }
    else if (inSchemaMap && typeof inSchemaMap === "object") {

      if (Object.keys(inSchemaMap).length === 0) {

        this._anyKey = false;

        //disallow all keys!

      }
      else {

        this._anyKey = false;

        for (let key in inSchemaMap) {

          if (inSchemaMap.hasOwnProperty(key)) {

            if (inSchemaMap[key] && inSchemaMap[key] instanceof AnySchema && inSchemaMap[key].internalJSONSchema && inSchemaMap[key].internalJSONSchema._requiredFlag === true && this._requiredKeys.indexOf(key) === -1) {

              this._requiredKeys.push(key);

            }

            if (!this._properties.hasOwnProperty(key) || !this._properties[key] || !(this._properties[key] instanceof AnySchema)) {

              this._properties[key] = inSchemaMap[key];

            }

          }

        }

        assign(this._properties, inSchemaMap);

      }

    }

    return this;

  }

  unknown(allowUnknown?:boolean):this {

    if (!allowUnknown) {

      this._anyKey = false;

    }
    else {

      this._anyKey = true;

    }

    return this;

  }

  min(limit:number):this {

    assert(typeof limit === "number" && limit >= 0, `Supplied minimumKeys limit must be a number and greater than or equal to 0`);

    this._minKeys = limit;

    return this;

  }

  max(limit:number):this {

    assert(typeof limit === "number" && limit >= 0, `Supplied maximumKeys limit must be a number and greater than or equal to 0`);

    this._maxKeys = limit;

    return this;

  }

  length(limit:number):this {

    assert(typeof limit === "number" && limit >= 0, `Supplied keysLength limit must be a number and greater than or equal to 0`);

    this._maxKeys = this._minKeys = limit;

    return this;

  }

  pattern(regex:RegExp, schema:AnySchema):this {

    assert(regex instanceof RegExp, `Supplied regex not an instance of RegExp.`);
    assert(schema instanceof AnySchema, `Supplied schema not an instance of AnySchema`);

    this._keyPattern = regex;

    this._keyPatternSchema = schema;

    return this;

  }

  and(...peers:Array<string>):this {

    peers = SZValidatorUtils.coerceArgs<string>(peers);

    const self = this;

    peers.forEach((peer, index) => {

      if (!self._andRulesMap[peer]) {
        self._andRulesMap[peer] = without(peers, peer);
      }
      else {
        self._andRulesMap[peer].push.apply(self._andRulesMap[peer], without(peers, peer));
      }

    });

    return this;

  }

  nand(...peers:Array<string>):this {

    peers = SZValidatorUtils.coerceArgs<string>(peers);

    const self = this;

    peers.forEach((peer, index) => {

      if (!self._nandRulesMap[peer]) {
        self._nandRulesMap[peer] = without(peers, peer);
      }
      else {
        self._nandRulesMap[peer].push.apply(self._nandRulesMap[peer], without(peers, peer));
      }

    });

    return this;

  }

  or(...peers:Array<string>):this {

    peers = SZValidatorUtils.coerceArgs<string>(peers);

    const self = this;

    peers.forEach((peer, index) => {

      if (!self._orRulesMap[peer]) {
        self._orRulesMap[peer] = without(peers, peer);
      }
      else {
        self._orRulesMap[peer].push.apply(self._orRulesMap[peer], without(peers, peer));
      }

    });

    return this;

  }

  xor(...peers:Array<string>):this {

    peers = SZValidatorUtils.coerceArgs<string>(peers);

    const self = this;

    peers.forEach((peer, index) => {

      if (!self._xorRulesMap[peer]) {
        self._xorRulesMap[peer] = without(peers, peer);
      }
      else {
        self._xorRulesMap[peer].push.apply(self._xorRulesMap[peer], without(peers, peer));
      }

    });

    return this;

  }

  with(key:string, ...peers:Array<string>):this {

    peers = SZValidatorUtils.coerceArgs<string>(peers);

    if (!this._withRules[key] || !Array.isArray(this._withRules[key])) {
      this._withRules[key] = peers;
    }
    else {
      this._withRules[key].push.apply(this._withRules[key], peers);
    }

    return this;

  }

  without(key:string, ...peers:Array<string>):this {

    peers = SZValidatorUtils.coerceArgs<string>(peers);

    if (!this._withoutRules[key] || !Array.isArray(this._withoutRules[key])) {
      this._withoutRules[key] = peers;
    }
    else {
      this._withoutRules[key].push.apply(this._withoutRules[key], peers);
    }

    return this;

  }

  rename(from:string, to:string, options?:ObjectSchemaRenameRuleOptions):this {

    this._renameRules[from] = new ObjectSchemaRenameRule(from, to, options);

    return this;

  }

  private _lookupOtherRename(from:string, targetTo:string) {

    let found = filter(this._renameRules, (ruleItem) => {

      return (ruleItem.from !== from && ruleItem.to === targetTo);

    });

    if (found.length > 0) {

      return found;

    }

    return false;

  }

  private _lookupTargetRename(target:string, override?:boolean) {

    let found = filter(this._renameRules, {to: target});

    let foundLen = found.length;

    if (override === true && foundLen > 0) {

      found = filter(found, (renameRule) => {

        return (renameRule && renameRule.options && renameRule.options.override === true);

      });

      if (found.length === foundLen) return found.length;

    }
    else if (foundLen > 0) {

      return found;

    }

    return false;

  }

  private _lookupFromAlias(target:string) {

    let found = filter(this._renameRules, {from: target, alias: true});

    if (found.length > 0) {

      return found;

    }

    return false;

  }

  assert(ref:string, assertRef:string)
  assert(ref:string, schema:AnySchema)
  assert(ref:string, assertRef:string, message:string)
  assert(ref:string, schema:AnySchema, message:string)
  assert(ref:string, schemaOrRef:AnySchema|string, message?:string):this {

    assert(typeof ref === "string", `Supplied reference must be a string`);


    if (!this._assertRules[ref] || !Array.isArray(this._assertRules[ref])) {

      if (typeof schemaOrRef === "string") {

        this._assertRules[ref] = [{

          ref: schemaOrRef,
          message: message

        }];

      }
      else {

        this._assertRules[ref] = [{

          schema: schemaOrRef,
          message: message

        }];

      }

    }
    else {

      if (typeof schemaOrRef === "string") {

        this._assertRules[ref].push({

          ref: schemaOrRef,
          message: message

        });

      }
      else {

        this._assertRules[ref].push({

          schema: schemaOrRef,
          message: message

        });

      }

    }

    return this;

  }

  type(constructor:Function, name?:string):this {

    assert(typeof constructor === "function", `Supplied constructor must be a function`);

    this._constructorType = constructor;

    if (name && typeof name === "string" && name.length > 0) {

      this._constructorTypeName = name;

    }

    return this;

  }

  schema(metaSchemaEnabled?:boolean):this {

    if (metaSchemaEnabled === false) {

      this._isMetaSchema = false;

    }
    else {

      this._isMetaSchema = true;

    }

    return this;

  }

  requiredKeys(...children:Array<string>):this {

    children = SZValidatorUtils.coerceArgs<string>(children);

    const self = this;

    children.forEach((key) => {

      checkOtherKeys(key, self._forbiddenKeys, self._optionalKeys);
      if (self._requiredKeys.indexOf(key) === -1) {
        self._requiredKeys.push(key);
      }

    });

    return this;

  }

  optionalKeys(...children:Array<string>):this {

    children = SZValidatorUtils.coerceArgs<string>(children);

    const self = this;

    children.forEach((key) => {

      checkOtherKeys(key, self._requiredKeys, self._forbiddenKeys);
      if (self._optionalKeys.indexOf(key) === -1) {
        self._optionalKeys.push(key);
      }

    });

    return this;

  }

  forbiddenKeys(...children:Array<string>):this {

    children = SZValidatorUtils.coerceArgs<string>(children);

    const self = this;

    children.forEach((key) => {

      checkOtherKeys(key, self._requiredKeys, self._optionalKeys);
      if (self._forbiddenKeys.indexOf(key) === -1) {
        self._forbiddenKeys.push(key);
      }

    });

    return this;

  }

  validate(value:object) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate === true) return valStack.value;

    valStack = AnySchema.checkInvalid(this, valStack);

    //check valids

    valStack = AnySchema.checkValid(this, valStack);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

    let globalError = false;

    //flatten the object..

    let stateObj = {

      _requiredList: [].concat(this._requiredKeys),
      _awaitingRequiredMap : {},
      _errorStack: new SchemaValidationErrors(this),
      _builtObj: {},
      _satisfiedOrMap : {},
      _awaitingXorMap : {},
      _awaitingAndMap : {},
      _awaitingNandMap : {},
      _awaitingWithMap : {},
      _discoveredWithoutMap : {},
      _discoveredForbiddenMap : {}

    };

    stateObj._requiredList.forEach((required) => {

      stateObj._awaitingRequiredMap[required] = true;

    });

    const useKeyPattern = (this._keyPattern && this._keyPattern instanceof RegExp && this._keyPatternSchema && this._keyPatternSchema instanceof AnySchema);

    let keyFailure = false, keyStripped = false, skipChecks = false;

    let isSchemaInstance = (valStack.value instanceof AnySchema);

    if (!this._isMetaSchema && isSchemaInstance) {

      globalError = true;

      stateObj._errorStack.setValue(valStack.value).setError(this.generateError(`schemaRule`, `The supplied item is an instance of schema and the schema rule hasn't been enabled.`));

    }
    else if (this._isMetaSchema === true) {

      if (isSchemaInstance) {

        stateObj._awaitingRequiredMap = {};

        stateObj._requiredList = [];

        skipChecks = true;

        stateObj._builtObj = valStack.value;

      }
      else {

        globalError = true;

        stateObj._errorStack.setError(this.generateError(`schemaRule`, `The supplied item is not an instance of AnySchema.`)).setValue(valStack.value);

      }

    }
    else if (this._constructorType && typeof this._constructorType === "function") {

      let isInstance = (valStack.value instanceof this._constructorType);

      if (!isInstance) {

        globalError = true;

        stateObj._errorStack.setError(this.generateError(`typeRule`, `The supplied item is not an instance of specified type` + (this._constructorTypeName && this._constructorTypeName.length > 0 ? `: ${this._constructorTypeName}` : "."))).setValue(valStack.value);

      }
      else {

        stateObj._builtObj = valStack.value;

      }

    }
    else {

      for (let key in valStack.value) {

        if (!valStack.value.hasOwnProperty(key)) continue;

        keyFailure = false;

        keyStripped = false;

        if (this._forbiddenKeys.indexOf(key) >= 0) {

          stateObj._errorStack.setKeyError(key, this.generateError(`forbiddenKeys`, `Supplied object has a key which is forbidden`), valStack.value[key]);

          continue;

        }
        else if (stateObj._requiredList.indexOf(key) >= 0) {

          pull(stateObj._requiredList, key);

        }

        if (stateObj._discoveredForbiddenMap.hasOwnProperty(key)) {

          stateObj._errorStack.setKeyError(key, this.generateError(stateObj._discoveredForbiddenMap[key].join(","), `Supplied object has failed on rules which forbid this key ${key} from existing.`), valStack.value[key]);

          delete stateObj._discoveredForbiddenMap[key];

          continue;

        }

        if (!this._properties.hasOwnProperty(key)) {

          if (useKeyPattern && this._keyPattern.test(key)) {

            //try the schema!

            try {

              let builtObj = this._keyPatternSchema.validate(valStack.value[key]);

              if (this._keyPatternSchema.internalJSONSchema._stripFlag === true) {

                keyStripped = true;

              }
              else {

                stateObj._builtObj[key] = builtObj;

              }

            }
            catch (ex) {

              stateObj._errorStack.setKeyError(key, ex, valStack.value[key]);

            }

          }
          else if (this._anyKey === true) {

            //allowed any key anyway!

            stateObj._builtObj[key] = this._anyKeySchema.validate(valStack.value[key]);

          }
          else {

            //unable to sort

            stateObj._errorStack.setKeyError(key, this.generateError(`unknownKey`, `Supplied object has a key which isn't defined and unknow keys aren't allowed`), valStack.value[key]);

          }

        }
        else {

          let oldKeyName: string = null;

          if (!this._properties[key].internalJSONSchema._stripFlag && this._renameRules.hasOwnProperty(key) && this._renameRules[key] instanceof ObjectSchemaRenameRule) {

            let renameRule = this._renameRules[key];

            oldKeyName = key;

            let existingOldKeyBuilt = stateObj._builtObj.hasOwnProperty(oldKeyName);

            let existingOldKey = (valStack.value.hasOwnProperty(oldKeyName) && this._properties[oldKeyName] instanceof AnySchema && !this._properties[oldKeyName].internalJSONSchema._stripFlag);

            key = renameRule.to;

            let existingNewKey = stateObj._builtObj.hasOwnProperty(key);

            let otherRules = this._lookupOtherRename(oldKeyName, renameRule.to);

            let otherRulesLen = otherRules.length;

            if (stateObj._discoveredForbiddenMap.hasOwnProperty(key)) {

              stateObj._errorStack.setKeyError(key, this.generateError(stateObj._discoveredForbiddenMap[key].join(","), `Supplied object has failed on rules which forbid this key ${key} from existing.`), valStack.value[key]);

              delete stateObj._discoveredForbiddenMap[key];

              continue;

            }

            try {

              let builtVal = null;

              if (this._properties.hasOwnProperty(key) && this._properties[key] instanceof AnySchema) {

                builtVal = this._properties[key].validate(valStack.value[oldKeyName]);

                if (this._properties[key].internalJSONSchema._stripFlag === true) {

                  keyStripped = true;

                }

              }
              else {

                builtVal = this._properties[oldKeyName].validate(valStack.value[oldKeyName]);

                if (this._properties[oldKeyName].internalJSONSchema._stripFlag === true) {

                  keyStripped = true;

                }

              }

              if (existingNewKey && !renameRule.optionsEnabled && otherRulesLen > 0) {

                keyFailure = true;

                stateObj._errorStack.setKeyError(key, this.generateError(`renameRule`, `Unable to rename ${oldKeyName} to ${key} as a value because a previously renamed key already present at ${key} and the multiple option isn't enabled.`), builtVal);

              }
              else if (existingNewKey && !renameRule.optionsEnabled) {

                keyFailure = true;

                stateObj._errorStack.setKeyError(key, this.generateError(`renameRule`, `Unable to rename ${oldKeyName} to ${key} as a value is already present at ${key} and the override option isn't enabled.`), builtVal);

              }
              else if (!keyStripped && renameRule.optionsEnabled === true) {

                if (renameRule.options.ignoreUndefined === true && builtVal === undefined) {

                  //set original value - we do this because we only got here if the validation rule allowed undefined int he first place

                  if (renameRule.options.setUndefinedOnFromKey === true) {

                    stateObj._builtObj[oldKeyName] = builtVal;

                    if (stateObj._awaitingRequiredMap.hasOwnProperty(oldKeyName) && stateObj._awaitingRequiredMap[oldKeyName] === true) {

                      delete stateObj._awaitingRequiredMap[oldKeyName];

                    }

                  }

                }
                else if (existingNewKey && otherRulesLen > 0 && renameRule.options.multiple !== true) {

                  keyFailure = true;

                  stateObj._errorStack.setKeyError(key, this.generateError(`renameRule`, `Unable to alias ${key} to ${oldKeyName} as a value because a previously renamed key already present at ${oldKeyName} and the multiple option isn't enabled.`), builtVal);

                }
                else if (existingNewKey && otherRulesLen === 0 && renameRule.options.override !== true) {

                  keyFailure = true;

                  stateObj._errorStack.setKeyError(key, this.generateError(`renameRule`, `Unable to alias ${key} to ${oldKeyName} as a value is already present at ${oldKeyName} and the override option isn't enabled.`), builtVal);

                }
                else if (renameRule.options.alias === true) {

                  if (existingNewKey && otherRulesLen > 0 && renameRule.options.multiple !== true) {

                    keyFailure = true;

                    stateObj._errorStack.setKeyError(key, this.generateError(`renameRule`, `Unable to alias ${key} to ${oldKeyName} as a value is already present at ${oldKeyName} and the multiple option isn't enabled.`), builtVal);

                  }
                  else {

                    if (renameRule.options.setUndefinedOnFromKey === true) {

                      stateObj._builtObj[oldKeyName] = undefined;

                      stateObj._builtObj[key] = builtVal;

                    }
                    else {

                      stateObj._builtObj[oldKeyName] = stateObj._builtObj[key] = builtVal;

                    }

                    if (stateObj._awaitingRequiredMap.hasOwnProperty(key) && stateObj._awaitingRequiredMap[key] === true) {

                      delete stateObj._awaitingRequiredMap[key];

                    }

                    if (stateObj._awaitingRequiredMap.hasOwnProperty(oldKeyName) && stateObj._awaitingRequiredMap[oldKeyName] === true) {

                      delete stateObj._awaitingRequiredMap[oldKeyName];

                    }

                  }

                }
                else {

                  stateObj._builtObj[key] = builtVal;

                  if (renameRule.options.setUndefinedOnFromKey === true) {

                    stateObj._builtObj[oldKeyName] = undefined;

                  }

                  if (stateObj._awaitingRequiredMap.hasOwnProperty(key) && stateObj._awaitingRequiredMap[key] === true) {

                    delete stateObj._awaitingRequiredMap[key];

                  }

                  if (stateObj._awaitingRequiredMap.hasOwnProperty(oldKeyName) && stateObj._awaitingRequiredMap[oldKeyName] === true) {

                    delete stateObj._awaitingRequiredMap[oldKeyName];

                  }

                }

                if (renameRule.options.setUndefinedOnFromKey === true) {

                  stateObj._builtObj[oldKeyName] = undefined;

                }

              }
              else {

                stateObj._builtObj[key] = builtVal;

                if (stateObj._awaitingRequiredMap.hasOwnProperty(key) && stateObj._awaitingRequiredMap[key] === true) {

                  delete stateObj._awaitingRequiredMap[key];

                }

                if (stateObj._awaitingRequiredMap.hasOwnProperty(oldKeyName) && stateObj._awaitingRequiredMap[oldKeyName] === true) {

                  delete stateObj._awaitingRequiredMap[oldKeyName];

                }

              }

            }
            catch (ex) {

              keyFailure = true;

              stateObj._errorStack.setKeyError(key, ex, valStack.value[key]);

            }

          }
          else if (stateObj._builtObj.hasOwnProperty(key)) {

            if (this._lookupTargetRename(key, true)) {

              //the key was targeted for a rename and override was set - this is fine... we do nothing here as we are going to allow the and/nand/or/xor rules to run...

            }
            else {

              keyFailure = true;

              stateObj._errorStack.setKeyError(key, this.generateError(`keyExists`, `Unable to set a value at ${key} because one already exists int he built object. If rename rules are in effect please ensure they are all set to override this key.`), valStack.value[key]);

            }

          }
          else {

            try {

              let builtObj = this._properties[key].validate(valStack.value[key]);

              if (this._properties[key].internalJSONSchema._stripFlag === true) {

                keyStripped = true;

              }
              else {

                stateObj._builtObj[key] = builtObj;

              }

              if (stateObj._awaitingRequiredMap.hasOwnProperty(key) && stateObj._awaitingRequiredMap[key] === true) {

                delete stateObj._awaitingRequiredMap[key];

              }

            }
            catch (ex) {

              keyFailure = true;

              stateObj._errorStack.setKeyError(key, ex, valStack.value[key]);

            }

          }

          //we have a direct property!


          //need to attempt direct validation!

          if (!keyFailure && !keyStripped) {

            if (this._andRulesMap.hasOwnProperty(key) && this._andRulesMap[key].length > 0) {

              //process and rules

              if (stateObj._awaitingAndMap.hasOwnProperty(key)) {

                delete stateObj._awaitingAndMap[key];

              }
              else {

                this._andRulesMap[key].forEach((andKey) => {

                  if (ChildKeyRegex.test(andKey)) {

                    let childItem = checkChildIfExists(andKey, stateObj._builtObj);

                    if (childItem !== undefined) {

                      if (stateObj._awaitingAndMap.hasOwnProperty(andKey)) {

                        delete stateObj._awaitingAndMap[andKey];

                      }

                    }
                    else {

                      stateObj._awaitingAndMap[andKey] = true;

                    }

                  }
                  else if (!stateObj._builtObj.hasOwnProperty(andKey) && !stateObj._awaitingAndMap.hasOwnProperty(andKey)) {

                    stateObj._awaitingAndMap[andKey] = true;

                  }

                });

              }

            }

            if (this._nandRulesMap.hasOwnProperty(key) && this._nandRulesMap[key].length > 0) {

              //process or rules...

              let nandRuleLen: number = this._nandRulesMap[key].length, nandKey = null;

              for (let nandRuleIndex = 0; nandRuleIndex < nandRuleLen; nandRuleIndex++) {

                nandKey = this._nandRulesMap[key][nandRuleIndex];

                if (ChildKeyRegex.test(nandKey)) {

                  let childItem = checkChildIfExists(nandKey, stateObj._builtObj);

                  if (childItem !== undefined) {

                    keyFailure = true;

                    stateObj._errorStack.setKeyError(key, this.generateError(`nandRule`, `nand rule has failed for key [${key}] as built object already contains key ${this._nandRulesMap[key][nandRuleIndex]}`), valStack.value[key]);

                  }
                  else if (!stateObj._discoveredForbiddenMap.hasOwnProperty(nandKey) || !Array.isArray(stateObj._discoveredForbiddenMap[nandKey])) {

                    stateObj._discoveredForbiddenMap[nandKey] = ["nandRule"];

                  }
                  else if (stateObj._discoveredForbiddenMap[nandKey].indexOf("nandRule") === -1) {

                    stateObj._discoveredForbiddenMap[nandKey].push("nandRule");

                  }

                }
                else if (stateObj._builtObj.hasOwnProperty(this._nandRulesMap[key][nandRuleIndex])) {

                  //not good - or rule has failed as there is already a property in there!

                  keyFailure = true;

                  stateObj._errorStack.setKeyError(key, this.generateError(`nandRule`, `nand rule has failed for key [${key}] as built object already contains key ${this._nandRulesMap[key][nandRuleIndex]}`), valStack.value[key]);

                }
                else {

                  if (!stateObj._discoveredForbiddenMap.hasOwnProperty(nandKey) || !Array.isArray(stateObj._discoveredForbiddenMap[nandKey])) {

                    stateObj._discoveredForbiddenMap[nandKey] = ["nandRule"];

                  }
                  else if (stateObj._discoveredForbiddenMap[nandKey].indexOf("nandRule") === -1) {

                    stateObj._discoveredForbiddenMap[nandKey].push("nandRule");

                  }

                }

              }

            }

            if (!keyFailure && this._xorRulesMap.hasOwnProperty(key) && this._xorRulesMap[key].length > 0) {

              //process or rules...

              let xorRuleLen: number = this._xorRulesMap[key].length, xorKey = null;

              for (let xorRuleIndex = 0; xorRuleIndex < xorRuleLen; xorRuleIndex++) {

                xorKey = this._xorRulesMap[key][xorRuleIndex];

                if (ChildKeyRegex.test(xorKey)) {

                  let childItem = checkChildIfExists(xorKey, stateObj._builtObj);

                  if (childItem !== undefined) {

                    keyFailure = true;

                    stateObj._errorStack.setKeyError(key, this.generateError(`xorRule`, `xor rule has failed for key [${key}] as built object already contains key ${xorKey}`), valStack.value[key]);

                  }
                  else if (!stateObj._discoveredForbiddenMap.hasOwnProperty(xorKey) || !Array.isArray(stateObj._discoveredForbiddenMap[xorKey])) {

                    stateObj._discoveredForbiddenMap[xorKey] = ["xorRule"];

                  }
                  else if (stateObj._discoveredForbiddenMap[xorKey].indexOf("xorRule") === -1) {

                    stateObj._discoveredForbiddenMap[xorKey].push("xorRule");

                  }

                }
                else if (stateObj._builtObj.hasOwnProperty(this._xorRulesMap[key][xorRuleIndex])) {

                  //not good - or rule has failed as there is already a property in there!

                  keyFailure = true;

                  stateObj._errorStack.setKeyError(key, this.generateError(`xorRule`, `xor rule has failed for key [${key}] as built object already contains key ${this._xorRulesMap[key][xorRuleIndex]}`), valStack.value[key]);

                }
                else {

                  if (!stateObj._discoveredForbiddenMap.hasOwnProperty(xorKey) || !Array.isArray(stateObj._discoveredForbiddenMap[xorKey])) {

                    stateObj._discoveredForbiddenMap[xorKey] = ["xorRule"];

                  }
                  else if (stateObj._discoveredForbiddenMap[xorKey].indexOf("xorRule") === -1) {

                    stateObj._discoveredForbiddenMap[xorKey].push("xorRule");

                  }

                }

              }

            }


            //if we get here with no failures then we are looking into with/without rules..... also looking into

            if (!keyFailure && this._withRules.hasOwnProperty(key) && Array.isArray(this._withRules[key]) && this._withRules[key].length > 0) {

              this._withRules[key].forEach((withKey) => {

                if (ChildKeyRegex.test(withKey)) {

                  let childItem = checkChildIfExists(withKey, stateObj._builtObj);

                  if (childItem === undefined) {

                    if (!stateObj._awaitingRequiredMap.hasOwnProperty(withKey) || !stateObj._awaitingRequiredMap[withKey]) {

                      stateObj._awaitingRequiredMap[withKey] = true;

                    }

                  }

                }
                if (!stateObj._builtObj.hasOwnProperty(withKey)) {

                  if (!stateObj._awaitingRequiredMap.hasOwnProperty(withKey) || !stateObj._awaitingRequiredMap[withKey]) {

                    stateObj._awaitingRequiredMap[withKey] = true;

                  }

                }

              });

            }

            if (!keyFailure && this._withoutRules.hasOwnProperty(key) && Array.isArray(this._withoutRules[key]) && this._withoutRules[key].length > 0) {

              this._withoutRules[key].forEach((withoutKey) => {

                if (stateObj._builtObj.hasOwnProperty(withoutKey)) {

                  keyFailure = true;

                  stateObj._errorStack.setKeyError(key, this.generateError(`withoutRule`, `without rule has failed for key [${key}] as built object already contains key ${withoutKey}`), valStack.value[key]);

                }
                else if (ChildKeyRegex.test(withoutKey)) {

                  let childItem = checkChildIfExists(withoutKey, stateObj._builtObj);

                  if (childItem !== undefined) {

                    keyFailure = true;

                    stateObj._errorStack.setKeyError(key, this.generateError(`withoutRule`, `without rule has failed for key [${key}] as built object already contains key ${withoutKey}`), valStack.value[key]);

                  }
                  else if (!stateObj._discoveredForbiddenMap.hasOwnProperty(withoutKey) || !Array.isArray(stateObj._discoveredForbiddenMap[withoutKey])) {

                    stateObj._discoveredForbiddenMap[withoutKey] = ["withoutRule"];

                  }
                  else if (stateObj._discoveredForbiddenMap[withoutKey].indexOf("withoutRule") === -1) {

                    stateObj._discoveredForbiddenMap[withoutKey].push("withoutRule");

                  }

                }
                else {

                  if (!stateObj._discoveredForbiddenMap.hasOwnProperty(withoutKey) || !Array.isArray(stateObj._discoveredForbiddenMap[withoutKey])) {

                    stateObj._discoveredForbiddenMap[withoutKey] = ["withoutRule"];

                  }
                  else if (stateObj._discoveredForbiddenMap[withoutKey].indexOf("withoutRule") === -1) {

                    stateObj._discoveredForbiddenMap[withoutKey].push("withoutRule");

                  }

                }

              });

            }

          }

        }

      }

    }

    //processing of all keys complete now perform cleanup on required items etc..

    if (!skipChecks) {

      if (this._assertRules && Object.keys(this._assertRules).length > 0) {

        for (let key in this._assertRules) {

          if (this._assertRules.hasOwnProperty(key) && stateObj._builtObj.hasOwnProperty(key) && Array.isArray(this._assertRules[key]) && this._assertRules[key].length > 0) {

            this._assertRules[key].forEach((assertionTarget) => {

              if (assertionTarget) {

                let message = (assertionTarget.message && assertionTarget.message.length > 0 ? `: ${assertionTarget.message}` : `.`);

                try {

                  if (assertionTarget.schema instanceof AnySchema && assertionTarget.schema.validate(stateObj._builtObj[key]) !== stateObj._builtObj[key]) {

                    stateObj._errorStack.setKeyError(key, this.generateError(`assertionRule`, `the assertion rule on ${key} has failed as the values don't equal after the supplied schema passed validation` + message), stateObj._builtObj[key]);

                  }
                  else if (assertionTarget.ref && typeof assertionTarget.ref === "string") {

                    let found = checkChildIfExists(assertionTarget.ref, stateObj._builtObj);

                    if ((found === undefined && stateObj._builtObj[key] !== undefined) || found !== stateObj._builtObj[key]) {

                      stateObj._errorStack.setKeyError(key, this.generateError(`assertionRule`, `the assertion rule on ${key} referencing ${assertionTarget.ref} has failed as the values don't equal` + message), stateObj._builtObj[key]);

                    }

                  }

                }
                catch (ex) {

                  stateObj._errorStack.setKeyError(key, this.generateError(`assertionRule`, `the assertion rule on ${key} has failed as the values don't equal or the supplied schema didn't pass validation` + message), stateObj._builtObj[key]);

                }

              }

            });

          }

        }

      }

      if (Object.keys(this._orRulesMap).length > 0) {

        let orMap = clone(this._orRulesMap);

        for (let key in this._orRulesMap) {

          if (orMap.hasOwnProperty(key) && stateObj._builtObj.hasOwnProperty(key) && orMap[key] && Array.isArray(orMap[key]) && orMap[key].length > 0) {

            orMap[key].forEach((reqKey) => {

              if (orMap.hasOwnProperty(reqKey)) {

                delete orMap[reqKey];

              }

            });

            delete orMap[key];

          }

        }

        if (Object.keys(orMap).length > 0) {

          for (let key in orMap) {

            if (orMap.hasOwnProperty(key)) {

              stateObj._errorStack.setKeyError(key, this.generateError(`orRule`, `one of keys [${orMap[key].join(", ")}] don't exist on built object`), null);

            }

          }

        }

      }

      if (Object.keys(this._andRulesMap).length > 0) {

        let andMap = clone(this._andRulesMap);

        for (let key in this._andRulesMap) {

          if (andMap.hasOwnProperty(key)) {

            if (ChildKeyRegex.test(key)) {

              let childItem = checkChildIfExists(key, stateObj._builtObj);

              if (childItem !== undefined) {

                delete andMap[key];

              }

            }
            else if (stateObj._builtObj.hasOwnProperty(key) && stateObj._builtObj[key] !== null && stateObj._builtObj[key] !== undefined) {

              delete andMap[key];

            }

          }

        }

        if (Object.keys(andMap).length > 0) {

          for (let key in andMap) {

            if (andMap.hasOwnProperty(key)) {

              stateObj._errorStack.setKeyError(key, this.generateError(`orRule`, `all the keys [${andMap[key].join(", ")}] don't exist on built object`), null);

            }

          }

        }

      }

      for (let key in stateObj._awaitingRequiredMap) {

        if (stateObj._awaitingRequiredMap.hasOwnProperty(key) && stateObj._awaitingRequiredMap[key] === true) {

          if (ChildKeyRegex.test(key)) {

            let childItem = checkChildIfExists(key, stateObj._builtObj);

            if (childItem === undefined) {

              stateObj._errorStack.setKeyError(key, this.generateError(`requiredRule`, `key [${key}] doesn't exist on built object`), null);

            }
            else {

              delete stateObj._awaitingRequiredMap[key];

            }

          }
          else if (stateObj._builtObj.hasOwnProperty(key) && stateObj._builtObj[key] !== null && stateObj._builtObj[key] !== undefined) {

            delete stateObj._awaitingRequiredMap[key];

          }
          else {

            stateObj._errorStack.setKeyError(key, this.generateError(`requiredRule`, `key [${key}] doesn't exist on built object`), null);

          }

        }

      }

      //now check for forbidden items!

      for (let key in stateObj._discoveredForbiddenMap) {

        if (stateObj._discoveredForbiddenMap.hasOwnProperty(key) && stateObj._discoveredForbiddenMap[key] && Array.isArray(stateObj._discoveredForbiddenMap[key] && stateObj._discoveredForbiddenMap[key].length > 0)) {

          if (ChildKeyRegex.test(key)) {

            let childItem = checkChildIfExists(key, stateObj._builtObj);

            if (childItem !== undefined) {

              stateObj._errorStack.setKeyError(key, this.generateError(`forbiddenRule`, `key [${key}] exists on built object but that key is forbidden.`), null);

            }
            else {

              delete stateObj._discoveredForbiddenMap[key];

            }

          }
          else if (!stateObj._builtObj.hasOwnProperty(key) || stateObj._builtObj[key] === null || stateObj._builtObj[key] === undefined) {

            delete stateObj._discoveredForbiddenMap[key];

          }
          else {

            stateObj._errorStack.setKeyError(key, this.generateError(`forbiddenRule`, `key [${key}] exists on built object but that key is forbidden.`), null);

          }

        }

      }

      if (this._minKeys >= 0 || this._maxKeys >= 0) {

        let keyLen = Object.keys(stateObj._builtObj).length;

        if (keyLen < this._minKeys) {

          stateObj._errorStack.setKeyError("*", this.generateError(`minimumKeysRule`, `the number of keys ${keyLen} in the built object is less than the allowed minimum number of keys ${this._minKeys}.`), null);

        }

        if (keyLen > this._maxKeys) {

          stateObj._errorStack.setKeyError("*", this.generateError(`maximumKeysRule`, `the number of keys ${keyLen} in the built object is larger than the allowed maximum number of keys ${this._maxKeys}.`), null);

        }

      }

    }

    if (!globalError) {

      globalError = (stateObj._errorStack.itemErrors.length > 0) || false;

    }

    if (Object.keys(stateObj._awaitingRequiredMap).length > 0 && filter(stateObj._awaitingRequiredMap, (item) => { return item === true }).length > 0 || stateObj._requiredList.length > 0) {

      globalError = true;

      stateObj._errorStack.setError(this.generateError(`required`, `The following keys are required and don't exist: ${(stateObj._requiredList || []).concat(Object.keys(stateObj._awaitingRequiredMap)).join(", ")}`)).setValue(stateObj._builtObj);

    }

    if (globalError) throw stateObj._errorStack.makeError();

    return AnySchema.postValidate(this, stateObj._builtObj, value);

  }

}

function checkChildIfExists(keyPath:string, builtObj:object) {

  let found = dot.pick(keyPath, builtObj);

  if (found !== null && found !== undefined) {

    return found;

  }

  return undefined;

}


function walkObject(parentKeyPath:string, currentObj:object) {

  const self = this;

  let fullKeyPath = null, currentObjItem = null;

  for (let key in currentObj) {

    fullKeyPath = parentKeyPath + "." + key;

    if (this._forbiddenKeys.indexOf(fullKeyPath) >= 0) {



    }
    else if (this._requiredKeys.indexOf(fullKeyPath)) {



    }

  }

}


function checkOtherKeys(key:string, otherA:Array<string>, otherB:Array<string>) {

  if (otherA.indexOf(key) >= 0) {

    pull(otherA, key);

  }
  else if (otherB.indexOf(key) >= 0) {

    pull(otherB, key);

  }

  return;

}
