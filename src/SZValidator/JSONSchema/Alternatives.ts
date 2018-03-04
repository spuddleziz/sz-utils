import {Schema} from "./Schema";
import {Types} from "./Types";
import * as assert from "assert";


export class SZAlternatives extends Schema<any> {

  _oneOf:Array<Schema<any>>;

  constructor() {

    super();

  }

  setOneOf(oneOfArray:Array<Schema<any>>) {

    assert(Array.isArray(oneOfArray), `Supplied ordered property must be an array of schemas`);

    this._oneOf = oneOfArray;

  }

  toJSON() {

    let outSchema = {

      oneOf : this._oneOf || []

    };

    return Schema.toJSON(this, outSchema);

  }

}
