import {Schema} from "./Schema";
import {Types} from "./Types";
import { isBrowser, isNode } from 'browser-or-node';
let Buffer = null;
if (isBrowser) {

  Buffer = require('buffer/').Buffer;

}
else if (isNode) {

  Buffer = require('buffer').Buffer;

}


export class SZBinaryBuffer extends Schema<Buffer> {

  constructor() {

    super([
      Types.array,
      Types.string,
      Types.null
    ]);

  }



}


