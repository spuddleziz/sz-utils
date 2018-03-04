import {Schema} from "./Schema";
import {Types} from "./Types";


export class SZDate extends Schema<number> {

  _format:string = "date-time";

  constructor() {

    super(Types.string);

  }

  setTimstamp() {

    this._type = Types.number;

  }
  toJSON() {

    switch(this._type) {

      case Types.number:
        return Schema.toJSON(this);
      case Types.string:
        return Schema.toJSON(this, {

          format: this._format

        });
      default:
        throw new Error(`This error should not occur. Type is not set to string or number for Date schema`);

    }

  }

}
