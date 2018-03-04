"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const Types_1 = require("./Types");
const assert = require("assert");
class SZObject extends Schema_1.Schema {
    constructor() {
        super(Types_1.Types.object);
        this._properties = {};
        this._required = [];
    }
    setAdditionalProperties(additionalPropsEnabled) {
        if (additionalPropsEnabled === false) {
            this.additionalProperties = false;
        }
        else {
            this.additionalProperties = true;
        }
        return this;
    }
    setProperties(inProperties) {
        if (!inProperties || Object.keys(inProperties).length === 0) {
            return;
        }
        for (let key in inProperties) {
            if (inProperties.hasOwnProperty(key) && inProperties[key] instanceof Schema_1.Schema) {
                this._properties[key] = inProperties[key];
                if (inProperties[key]._requiredFlag === true && this._required.indexOf(key) === -1) {
                    this._required.push(key);
                }
            }
        }
    }
    setKeyPattern(regex, rule) {
        assert(rule instanceof Schema_1.Schema, `Supplied rule must be an instance of schema`);
        let keyPatternObj = {
            regex: "",
            rule: null
        };
        if (typeof regex === "string") {
            keyPatternObj.regex = regex.replace(/^\//, '').replace(/\/$/, '');
        }
        else if (regex && regex.test && typeof regex.test === "function") {
            keyPatternObj.regex = regex.source.replace(/^\//, '').replace(/\/$/, '');
        }
        else {
            throw new Error();
        }
        keyPatternObj.rule = rule;
        this._keyPattern = keyPatternObj;
    }
    toJSON() {
        let outSchema = {
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
        if (this._keyPattern && this._keyPattern.regex && this._keyPattern.rule instanceof Schema_1.Schema) {
            outSchema.patterns = {
                regex: this._keyPattern.regex,
                rule: this._keyPattern.rule.toJSON()
            };
        }
        return Schema_1.Schema.toJSON(this, outSchema);
    }
}
exports.SZObject = SZObject;
//# sourceMappingURL=Object.js.map