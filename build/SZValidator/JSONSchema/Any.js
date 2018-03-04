"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const Types_1 = require("./Types");
class SZAny extends Schema_1.Schema {
    constructor() {
        super([
            Types_1.Types.array,
            Types_1.Types.boolean,
            Types_1.Types.number,
            Types_1.Types.object,
            Types_1.Types.string,
            Types_1.Types.null
        ]);
    }
}
exports.SZAny = SZAny;
//# sourceMappingURL=Any.js.map