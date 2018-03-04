import {Schema} from "./Schema";
import {Types} from "./Types";
import * as assert from "assert";


export class SZNumber extends Schema<number> {

  minimum:number;
  exclusiveMinimum:boolean;

  maximum:number;
  exclusiveMaximum:boolean;

  constructor() {

    super(Types.number);

  }

  setInteger() {

    this._type = Types.integer;

  }

  setMinimum(min:number, exclusive?:boolean) {

    assert(typeof min === "number", `Supplied minimum must be a number`);

    this.minimum = min;

    if (exclusive === true) {

      this.exclusiveMinimum = true;

    }

  }

  setMaximum(max:number, exclusive?:boolean) {

    assert(typeof max === "number", `Supplied maximum must be a number`);

    this.maximum = max;

    if (exclusive === true) {

      this.exclusiveMaximum = true;

    }

  }

}
