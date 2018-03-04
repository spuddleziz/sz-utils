"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const Types_1 = require("./Types");
class SZDate extends Schema_1.Schema {
    constructor() {
        super(Types_1.Types.string);
        this._format = "date-time";
    }
    setTimstamp() {
        this._type = Types_1.Types.number;
    }
    toJSON() {
        switch (this._type) {
            case Types_1.Types.number:
                return Schema_1.Schema.toJSON(this);
            case Types_1.Types.string:
                return Schema_1.Schema.toJSON(this, {
                    format: this._format
                });
            default:
                throw new Error(`This error should not occur. Type is not set to string or number for Date schema`);
        }
    }
}
exports.SZDate = SZDate;
//# sourceMappingURL=Date.js.map