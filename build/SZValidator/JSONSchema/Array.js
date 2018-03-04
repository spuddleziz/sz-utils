"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = require("./Schema");
const Types_1 = require("./Types");
const assert = require("assert");
const lodash_1 = require("lodash");
class SZArray extends Schema_1.Schema {
    constructor() {
        super(Types_1.Types.array);
        this._oneOf = [];
        this._ordered = [];
    }
    setUniqueItems(enabled) {
        this.uniqueItems = enabled === true;
    }
    setLength(length) {
        assert(typeof length === "number", `Supplied length must be a number`);
        this.minItems = this.maxItems = length;
    }
    setMinItems(minItems) {
        assert(typeof minItems === "number", `Supplied minItems must be a number`);
        this.minItems = minItems;
    }
    setMaxItems(maxItems) {
        assert(typeof maxItems === "number", `Supplied maxItems must be a number`);
        this.maxItems = maxItems;
    }
    setOrdered(ordered) {
        assert(Array.isArray(ordered), `Supplied ordered property must be an array of schemas`);
        this._ordered = ordered;
    }
    setItems(inSchema) {
        assert(inSchema instanceof Schema_1.Schema || (Array.isArray(inSchema) && inSchema.length > 0), `Supplied items property must be a schema or an array of schemas`);
        if (Array.isArray(inSchema)) {
            if (inSchema.length > 1) {
                this._oneOf = inSchema;
            }
            else {
                this._items = inSchema[0];
            }
        }
        else if (inSchema instanceof Schema_1.Schema) {
            this._items = inSchema;
        }
    }
    toJSON() {
        let outSchema = {};
        if (this._ordered && Array.isArray(this._ordered) && this._ordered.length > 0) {
            outSchema.ordered = this._ordered.map((orderedItem) => { return orderedItem.toJSON(); });
        }
        if (this._oneOf && this._oneOf.length > 0) {
            let schemaArray = lodash_1.map(lodash_1.filter(this._oneOf, { _notAllowed: false }), (itSchema) => {
                return itSchema.toJSON();
            });
            outSchema.items = {
                oneOf: schemaArray
            };
        }
        else if (this._items instanceof Schema_1.Schema && !this._items._notAllowed) {
            outSchema.items = this._items.toJSON();
        }
        return Schema_1.Schema.toJSON(this, outSchema);
    }
}
exports.SZArray = SZArray;
//# sourceMappingURL=Array.js.map