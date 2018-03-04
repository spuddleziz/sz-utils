"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const Types_1 = require("./Types");
const assert = require("assert");
var StringFormats;
(function (StringFormats) {
    StringFormats["Uri"] = "uri";
    StringFormats["Email"] = "email";
})(StringFormats = exports.StringFormats || (exports.StringFormats = {}));
class SZString extends Schema_1.Schema {
    constructor() {
        super(Types_1.Types.string);
        this._oneOf = [];
    }
    setPatterns(inPatterns) {
        if (Array.isArray(inPatterns) && inPatterns.length > 0) {
            if (this.pattern && typeof this.pattern === "string" && this.pattern.length > 0) {
                this._oneOf.push(new SZString().setPattern(this.pattern));
                delete this.pattern;
            }
            inPatterns.forEach((npattern) => {
                if (Array.isArray(npattern)) {
                    this._oneOf.push(new SZString().setPatterns(npattern));
                }
                else if (npattern !== null && npattern !== undefined) {
                    this._oneOf.push(new SZString().setPattern(npattern));
                }
            });
        }
        return this;
    }
    setPattern(inPattern) {
        if (inPattern && inPattern.test && typeof inPattern.test === "function") {
            this.pattern = inPattern.source.replace(/^\//, '').replace(/\/$/, '');
        }
        else if (typeof inPattern === "string") {
            this.pattern = inPattern.replace(/^\//, '').replace(/\/$/, '');
        }
        else {
            throw new Error(`Supplied pattern must be a string or a regular expression.`);
        }
        return this;
    }
    setMinLength(min) {
        assert(typeof min === "number", `Supplied minimum must be a number`);
        this.minLength = min;
        return this;
    }
    setMaxLength(max) {
        assert(typeof max === "number", `Supplied maximum must be a number`);
        this.maxLength = max;
        return this;
    }
    setLength(length) {
        assert(typeof length === "number", `Supplied length must be a number`);
        this.minLength = this.maxLength = length;
        return this;
    }
    setFormat(stringFormat) {
        this.format = stringFormat;
        return this;
    }
    toJSON() {
        let outSchema = {};
        if (this._oneOf && this._oneOf.length > 0) {
            outSchema.oneOf = this._oneOf;
            delete outSchema.pattern;
        }
        return Schema_1.Schema.toJSON(this, outSchema);
    }
}
exports.SZString = SZString;
//# sourceMappingURL=String.js.map