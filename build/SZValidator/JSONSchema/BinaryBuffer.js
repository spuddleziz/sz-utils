"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const Types_1 = require("./Types");
const browser_or_node_1 = require("browser-or-node");
let Buffer = null;
if (browser_or_node_1.isBrowser) {
    Buffer = require('buffer/').Buffer;
}
else if (browser_or_node_1.isNode) {
    Buffer = require('buffer').Buffer;
}
class SZBinaryBuffer extends Schema_1.Schema {
    constructor() {
        super([
            Types_1.Types.array,
            Types_1.Types.string,
            Types_1.Types.null
        ]);
    }
}
exports.SZBinaryBuffer = SZBinaryBuffer;
//# sourceMappingURL=BinaryBuffer.js.map