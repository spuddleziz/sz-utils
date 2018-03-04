import {Schema} from "./Schema";
import {Types} from "./Types";


export class SZBoolean extends Schema<boolean> {

  constructor() {

    super(Types.boolean);

  }

}
