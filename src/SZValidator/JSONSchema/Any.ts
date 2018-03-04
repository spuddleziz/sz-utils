import {Schema} from "./Schema";
import {Types} from "./Types";


export class SZAny extends Schema<any> {

  constructor() {

    super([
      Types.array,
      Types.boolean,
      Types.number,
      Types.object,
      Types.string,
      Types.null
    ]);

  }

}


