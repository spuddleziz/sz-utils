import {Schema} from "./Schema";
import {Types} from "./Types";
import * as assert from "assert";

export enum StringFormats {

  Uri = "uri",
  Email = "email"

}

export class SZString extends Schema<string> {

  pattern:string;
  minLength:number;
  maxLength:number;
  format:StringFormats;
  _oneOf:Array<SZString> = [];

  constructor() {

    super(Types.string);

  }

  setPatterns(inPatterns:Array<string|RegExp|Array<string|RegExp>>) {

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

  setPattern(inPattern:string|RegExp) {

    if (inPattern && (<RegExp>inPattern).test && typeof (<RegExp>inPattern).test === "function") {

      this.pattern = (<RegExp>inPattern).source.replace(/^\//,'').replace(/\/$/,'');

    }
    else if (typeof inPattern === "string") {

      this.pattern = inPattern.replace(/^\//,'').replace(/\/$/,'');

    }
    else {

      throw new Error(`Supplied pattern must be a string or a regular expression.`)

    }

    return this;

  }

  setMinLength(min:number) {

    assert(typeof min === "number", `Supplied minimum must be a number`);

    this.minLength = min;

    return this;

  }

  setMaxLength(max:number) {

    assert(typeof max === "number", `Supplied maximum must be a number`);

    this.maxLength = max;

    return this;

  }

  setLength(length:number) {

    assert(typeof length === "number", `Supplied length must be a number`);

    this.minLength = this.maxLength = length;

    return this;

  }

  setFormat(stringFormat:StringFormats) {

    this.format = stringFormat;

    return this;

  }

  toJSON() {

    let outSchema:any = {};

    if (this._oneOf && this._oneOf.length > 0) {

      outSchema.oneOf = this._oneOf;

      delete outSchema.pattern;

    }

    return Schema.toJSON(this, outSchema);

  }

}
