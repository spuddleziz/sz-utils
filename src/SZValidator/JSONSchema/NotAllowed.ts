import {Schema} from "./Schema";
import {Types} from "./Types";


export class SZNotAllowed extends Schema<null> {

  constructor() {

    super(Types.null);

    this._notAllowed = true;

  }

  toJSON() {

    return null;

  }

}
