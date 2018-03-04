"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnySchema_1 = require("./SZSchemas/AnySchema");
const ArraySchema_1 = require("./SZSchemas/ArraySchema");
const BooleanSchema_1 = require("./SZSchemas/BooleanSchema");
const lodash_1 = require("lodash");
const BinarySchema_1 = require("./SZSchemas/BinarySchema");
const DateSchema_1 = require("./SZSchemas/DateSchema");
const StringSchema_1 = require("./SZSchemas/StringSchema");
const ObjectSchema_1 = require("./SZSchemas/ObjectSchema");
const NumberSchema_1 = require("./SZSchemas/NumberSchema");
const FuncSchema_1 = require("./SZSchemas/FuncSchema");
const AlternativesSchema_1 = require("./SZSchemas/AlternativesSchema");
function createSchemaFromRoot(rootFN) {
}
class SZSchemaBuilderOptions {
    constructor(inOpts) {
        this.convert = true;
        if (inOpts && Object.keys(inOpts).length > 0) {
            lodash_1.assign(this, inOpts);
        }
    }
    set(inOpts) {
        if (inOpts && Object.keys(inOpts).length > 0) {
            lodash_1.assign(this, inOpts);
        }
    }
}
const SZ_BUILDER_OPTIONS = new SZSchemaBuilderOptions();
class SZSchemaBuilder {
    static getOptions() {
        return SZ_BUILDER_OPTIONS;
    }
    static setOptions(inOpts) {
        SZ_BUILDER_OPTIONS.set(inOpts);
    }
    static any() {
        return new AnySchema_1.AnySchema();
    }
    static array() {
        return new ArraySchema_1.ArraySchema();
    }
    static boolean() {
        return new BooleanSchema_1.BooleanSchema();
    }
    static binary() {
        return new BinarySchema_1.BinarySchema();
    }
    static date() {
        return new DateSchema_1.DateSchema();
    }
    static func() {
        return new FuncSchema_1.FuncSchema();
    }
    static number() {
        return new NumberSchema_1.NumberSchema();
    }
    static object(objectSchemaMap) {
        return new ObjectSchema_1.ObjectSchema(objectSchemaMap);
    }
    static string() {
        return new StringSchema_1.StringSchema();
    }
    static alternatives(altSchemas) {
        return new AlternativesSchema_1.AlternativesSchema(altSchemas);
    }
}
exports.SZSchemaBuilder = SZSchemaBuilder;
//# sourceMappingURL=Builder.js.map