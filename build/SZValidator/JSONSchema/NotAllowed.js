"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const Types_1 = require("./Types");
class SZNotAllowed extends Schema_1.Schema {
    constructor() {
        super(Types_1.Types.null);
        this._notAllowed = true;
    }
    toJSON() {
        return null;
    }
}
exports.SZNotAllowed = SZNotAllowed;
//# sourceMappingURL=NotAllowed.js.map