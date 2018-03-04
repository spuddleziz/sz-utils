import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZArray} from "../JSONSchema/Array";
import {SZAny} from "../JSONSchema/Any";
import {SchemaValidationFailedError} from "../SchemaError";
import { isBrowser, isNode } from 'browser-or-node';
import {AnySchema} from "./AnySchema";
import * as assert from "assert";
import {SZBinaryBuffer} from "../JSONSchema/BinaryBuffer";
let Buffer = null;
if (isBrowser) {

  Buffer = require('buffer/').Buffer;

}
else if (isNode) {

  Buffer = require('buffer').Buffer;

}

export enum BinarySchemaEncodingOption {

  ASCII = "ascii",
  UTF8 = "utf8",
  UCS2 = "ucs2",
  UTF16LE = "utf16le",
  BASE64 = "base64",
  LATIN1 = "latin1",
  BINARY = "binary",
  HEX = "hex"

}

const DEFAULT_ENCODING = BinarySchemaEncodingOption.UTF8;


export class BinarySchema extends AnySchema {

  public internalJSONSchema:SZBinaryBuffer;
  private _encoding:BinarySchemaEncodingOption = DEFAULT_ENCODING;
  _minLength:number;
  _maxLength:number;


  constructor() {

    super(SZSchemaTypes.Binary);

    this.internalJSONSchema = new SZBinaryBuffer();

  }

  public valid(...values:Array<Buffer|string|Uint8Array>):this {

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

  public invalid(...values:Array<Buffer|string|Uint8Array>):this {

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

  encoding(encoding:BinarySchemaEncodingOption):this {

    if (encoding && BinarySchemaEncodingOption[encoding.toUpperCase()]) {

      this._encoding = encoding;

    }
    else {

      this._encoding = DEFAULT_ENCODING;

    }

    return this;

  }

  min(limit:number):this {

    assert(typeof limit === "number" && limit >= 0, `Selected limit for minLength must be a number and more than or equal to 0`);

    this._minLength = limit;

    return this;

  }

  max(limit:number):this {

    assert(typeof limit === "number" && limit >= 0, `Selected limit for maxLength must be a number and more than or equal to 0`);

    this._maxLength = limit;

    return this;

  }

  length(limit:number):this {

    assert(typeof limit === "number" && limit >= 0, `Selected limit for length must be a number and more than or equal to 0`);

    this._maxLength = this._minLength = limit;

    return this;

  }

  validate(value:Buffer|string|Uint8Array) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate === true) return valStack.value;

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

    valStack = AnySchema.checkInvalid(this, valStack);

    //check valids

    valStack = AnySchema.checkValid(this, valStack);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

    if (this._minLength >= 0 && valStack.value.length < this._minLength) {

      throw this.generateError(`minLength`, "The Buffer is smaller than the specified minimum size.");

    }

    if (this._maxLength >= 0 && valStack.value.length > this._maxLength) {

      throw this.generateError(`maxLength`, "The Buffer is larger than the specified maximum size.");

    }

    return AnySchema.postValidate(this, valStack.value, value);

  }

}


