"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
const browser_or_node_1 = require("browser-or-node");
const AnySchema_1 = require("./AnySchema");
const assert = require("assert");
const BinaryBuffer_1 = require("../JSONSchema/BinaryBuffer");
let Buffer = null;
if (browser_or_node_1.isBrowser) {
    Buffer = require('buffer/').Buffer;
}
else if (browser_or_node_1.isNode) {
    Buffer = require('buffer').Buffer;
}
var BinarySchemaEncodingOption;
(function (BinarySchemaEncodingOption) {
    BinarySchemaEncodingOption["ASCII"] = "ascii";
    BinarySchemaEncodingOption["UTF8"] = "utf8";
    BinarySchemaEncodingOption["UCS2"] = "ucs2";
    BinarySchemaEncodingOption["UTF16LE"] = "utf16le";
    BinarySchemaEncodingOption["BASE64"] = "base64";
    BinarySchemaEncodingOption["LATIN1"] = "latin1";
    BinarySchemaEncodingOption["BINARY"] = "binary";
    BinarySchemaEncodingOption["HEX"] = "hex";
})(BinarySchemaEncodingOption = exports.BinarySchemaEncodingOption || (exports.BinarySchemaEncodingOption = {}));
const DEFAULT_ENCODING = BinarySchemaEncodingOption.UTF8;
class BinarySchema extends AnySchema_1.AnySchema {
    constructor() {
        super(BaseSchema_1.SZSchemaTypes.Binary);
        this._encoding = DEFAULT_ENCODING;
        this.internalJSONSchema = new BinaryBuffer_1.SZBinaryBuffer();
    }
    valid(...values) {
        const self = this;
        values.forEach((validVal) => {
            if (typeof validVal === "string") {
                self.internalJSONSchema._validValues.push(Buffer.from(validVal, self._encoding));
            }
            else if (validVal instanceof Uint8Array) {
                self.internalJSONSchema._validValues.push(Buffer.from(validVal));
            }
            else if (Buffer.isBuffer(validVal)) {
                self.internalJSONSchema._validValues.push(Buffer.from(validVal));
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
            if (typeof invalidVal === "string") {
                self._invalids.push(Buffer.from(invalidVal, self._encoding));
            }
            else if (invalidVal instanceof Uint8Array) {
                self._invalids.push(Buffer.from(invalidVal));
            }
            else if (Buffer.isBuffer(invalidVal)) {
                self._invalids.push(Buffer.from(invalidVal));
            }
            else {
                throw new Error(`Supplied valid value is not a a valid format`);
            }
        });
        return this;
    }
    encoding(encoding) {
        if (encoding && BinarySchemaEncodingOption[encoding.toUpperCase()]) {
            this._encoding = encoding;
        }
        else {
            this._encoding = DEFAULT_ENCODING;
        }
        return this;
    }
    min(limit) {
        assert(typeof limit === "number" && limit >= 0, `Selected limit for minLength must be a number and more than or equal to 0`);
        this._minLength = limit;
        return this;
    }
    max(limit) {
        assert(typeof limit === "number" && limit >= 0, `Selected limit for maxLength must be a number and more than or equal to 0`);
        this._maxLength = limit;
        return this;
    }
    length(limit) {
        assert(typeof limit === "number" && limit >= 0, `Selected limit for length must be a number and more than or equal to 0`);
        this._maxLength = this._minLength = limit;
        return this;
    }
    validate(value) {
        let valStack = AnySchema_1.AnySchema.preValidate(this, value);
        if (valStack.immediate === true)
            return valStack.value;
        if (typeof valStack.value === "string") {
            valStack.value = Buffer.from(valStack.value, this._encoding);
        }
        else if (valStack.value instanceof Uint8Array) {
            valStack.value = Buffer.from(valStack.value);
        }
        else if (!Buffer.isBuffer(valStack.value)) {
            throw this.generateError(`type`, "The supplied value is not one of the following types: Buffer, string, Uint8Array.");
        }
        //check invalids
        valStack = AnySchema_1.AnySchema.checkInvalid(this, valStack);
        //check valids
        valStack = AnySchema_1.AnySchema.checkValid(this, valStack);
        if (valStack.immediate === true)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        if (this._minLength >= 0 && valStack.value.length < this._minLength) {
            throw this.generateError(`minLength`, "The Buffer is smaller than the specified minimum size.");
        }
        if (this._maxLength >= 0 && valStack.value.length > this._maxLength) {
            throw this.generateError(`maxLength`, "The Buffer is larger than the specified maximum size.");
        }
        return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
    }
}
exports.BinarySchema = BinarySchema;
//# sourceMappingURL=BinarySchema.js.map