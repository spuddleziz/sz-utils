import {Schema} from "./Schema";
import {Types} from "./Types";
import {IDictionary} from "../../IDictionary";
import * as assert from "assert";


export class SZObject extends Schema<object> {

  _properties:IDictionary<Schema<any>> = {};
  _required:Array<string> = [];
  additionalProperties:boolean;
  _keyPattern:{ regex:string, rule:Schema<any> };

  constructor() {

    super(Types.object);

  }

  setAdditionalProperties(additionalPropsEnabled?:boolean) {

    if (additionalPropsEnabled === false) {

      this.additionalProperties = false;

    }
    else {

      this.additionalProperties = true;

    }

    return this;

  }

  setProperties(inProperties:IDictionary<Schema<any>>) {

    if (!inProperties || Object.keys(inProperties).length === 0) {
      return;
    }

    for (let key in inProperties) {

      if (inProperties.hasOwnProperty(key) && inProperties[key] instanceof Schema) {

        this._properties[key] = inProperties[key];

        if (inProperties[key]._requiredFlag === true && this._required.indexOf(key) === -1) {

          this._required.push(key);

        }

      }

    }

  }

  setKeyPattern(regex:string | RegExp, rule: Schema<any>) {

    assert(rule instanceof Schema, `Supplied rule must be an instance of schema`);

    let keyPatternObj = {

      regex: "",
      rule : null

    };

    if (typeof regex === "string") {

      keyPatternObj.regex = regex.replace(/^\//,'').replace(/\/$/,'');

    }
    else if (regex && (<RegExp>regex).test && typeof (<RegExp>regex).test === "function") {

      keyPatternObj.regex = (<RegExp>regex).source.replace(/^\//,'').replace(/\/$/,'');

    }
    else {

      throw new Error()

    }

    keyPatternObj.rule = rule;

    this._keyPattern = keyPatternObj;

  }

  toJSON() {

    let outSchema:any = {
      properties: {}
    };

    for (let key in this._properties) {

      if (this._properties.hasOwnProperty(key) && !this._properties[key]._notAllowed) {

        if (this._required.indexOf(key) === -1 && this._properties[key]._requiredFlag === true) {

          this._required.push(key);

        }

        outSchema.properties[key] = this._properties[key].toJSON();

      }

    }

    if (this.additionalProperties === true) {

      outSchema.additionalProperties = true;

    }
    else {

      outSchema.additionalProperties = false;

    }

    if (this._required.length > 0) {

      outSchema.required = this._required;

    }

    if (this._keyPattern && this._keyPattern.regex && this._keyPattern.rule instanceof Schema) {

      outSchema.patterns = {
        regex : this._keyPattern.regex,
        rule : this._keyPattern.rule.toJSON()
      };

    }

    return Schema.toJSON(this, outSchema);

  }

}
