"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const Types_1 = require("./Types");
const assert = require("assert");
class SZNumber extends Schema_1.Schema {
    constructor() {
        super(Types_1.Types.number);
    }
    setInteger() {
        this._type = Types_1.Types.integer;
    }
    setMinimum(min, exclusive) {
        assert(typeof min === "number", `Supplied minimum must be a number`);
        this.minimum = min;
        if (exclusive === true) {
            this.exclusiveMinimum = true;
        }
    }
    setMaximum(max, exclusive) {
        assert(typeof max === "number", `Supplied maximum must be a number`);
        this.maximum = max;
        if (exclusive === true) {
            this.exclusiveMaximum = true;
        }
    }
}
exports.SZNumber = SZNumber;
//# sourceMappingURL=Number.js.map