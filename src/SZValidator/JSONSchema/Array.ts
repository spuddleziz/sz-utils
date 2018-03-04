import {Schema} from "./Schema";
import {Types} from "./Types";
import * as assert from "assert";
import {map, filter} from "lodash";


export class SZArray<T> extends Schema<Array<T>> {

  uniqueItems:boolean;
  minItems:number;
  maxItems:number;
  _items:Schema<T>;
  _oneOf:Array<Schema<T>> = [];
  _ordered:Array<Schema<T>> = [];

  constructor() {

    super(Types.array);

  }

  setUniqueItems(enabled:boolean) {

    this.uniqueItems = enabled === true;

  }

  setLength(length:number) {

    assert(typeof length === "number", `Supplied length must be a number`);

    this.minItems = this.maxItems = length;

  }

  setMinItems(minItems:number) {

    assert(typeof minItems === "number", `Supplied minItems must be a number`);

    this.minItems = minItems;

  }

  setMaxItems(maxItems:number) {

    assert(typeof maxItems === "number", `Supplied maxItems must be a number`);

    this.maxItems = maxItems;

  }

  setOrdered(ordered:Array<Schema<T>>) {

    assert(Array.isArray(ordered), `Supplied ordered property must be an array of schemas`);

    this._ordered = ordered;

  }

  setItems(inSchema:Schema<T>)
  setItems(inSchema:Array<Schema<T>>)
  setItems(inSchema:Schema<T>|Array<Schema<T>>) {

    assert(inSchema instanceof Schema || (Array.isArray(inSchema) && inSchema.length > 0), `Supplied items property must be a schema or an array of schemas`);

    if (Array.isArray(inSchema)) {

      if (inSchema.length > 1) {

        this._oneOf = inSchema;

      }
      else {

        this._items = inSchema[0];

      }

    }
    else if (inSchema instanceof Schema) {

      this._items = inSchema;

    }

  }

  toJSON() {

    let outSchema:any = {};

    if (this._ordered && Array.isArray(this._ordered) && this._ordered.length > 0) {

      outSchema.ordered = this._ordered.map((orderedItem:Schema<T>) => { return orderedItem.toJSON() });

    }

    if (this._oneOf && this._oneOf.length > 0) {

      let schemaArray = map(filter(this._oneOf, { _notAllowed : false }),  (itSchema) => {

        return itSchema.toJSON();

      });

      outSchema.items = {

        oneOf : schemaArray

      };

    }
    else if (this._items instanceof Schema && !this._items._notAllowed) {

      outSchema.items = this._items.toJSON();

    }

    return Schema.toJSON(this, outSchema);

  }

}
