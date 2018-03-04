"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const assert = require("assert");
class SZAlternatives extends Schema_1.Schema {
    constructor() {
        super();
    }
    setOneOf(oneOfArray) {
        assert(Array.isArray(oneOfArray), `Supplied ordered property must be an array of schemas`);
        this._oneOf = oneOfArray;
    }
    toJSON() {
        let outSchema = {
            oneOf: this._oneOf || []
        };
        return Schema_1.Schema.toJSON(this, outSchema);
    }
}
exports.SZAlternatives = SZAlternatives;
//# sourceMappingURL=Alternatives.js.map