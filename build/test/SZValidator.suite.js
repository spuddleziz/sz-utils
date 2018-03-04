"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
let colors = require('mocha/lib/reporters/base').colors;
colors['diff gutter'] = 92;
colors['diff added'] = 32;
colors['diff removed'] = 31;
colors['error stack'] = 92;
colors.progress = 92;
colors.runway = 92;
colors.fast = 92;
colors.pass = 92;
const chai_1 = require("chai");
const SZValidator_1 = require("../SZValidator");
let anySchema = SZValidator_1.SZSchemaBuilder.any();
let anySchemaJSON = { type: ['array', 'boolean', 'number', 'object', 'string', 'null'] };
let arraySchema = SZValidator_1.SZSchemaBuilder.array();
let arraySchemaJSON = { type: 'array' };
let arrayAnyItemSchema = SZValidator_1.SZSchemaBuilder.any();
let arrayAnyItemSchemaJSON = { type: 'array', items: anySchemaJSON };
let stringSchemaHello = SZValidator_1.SZSchemaBuilder.string().regex(/^hello$/);
let stringSchemaJSON = { type: "string" };
let stringSchemaHelloJSON = { type: "string", pattern: "^hello$" };
let booleanSchema = SZValidator_1.SZSchemaBuilder.boolean();
let booleanSchemaJSON = { type: 'boolean' };
let booleanFalsey = ["n", "false", 0];
let booleanTruthy = ["y", "true", 1];
let SZSchemaBuilderTests = class SZSchemaBuilderTests {
    "SchemaBuilder can make AnySchemas"() {
        chai_1.expect(anySchema).to.instanceOf(SZValidator_1.AnySchema, `Schema is not an instance of AnySchema`);
    }
    "generate a JSON schema for AnySchema"() {
        let jsonSchema = anySchema.getJSONSchema();
        chai_1.expect(jsonSchema).to.eql(anySchemaJSON, `JSON Schema generated doesn't match expected`);
    }
    "Add some properties to AnySchema that are used in JSONSchema"() {
        let description = "Test Description";
        let label = "Test Label";
        let jsonSchema = anySchema.description(description).label(label).getJSONSchema();
        chai_1.expect(jsonSchema.title).to.eql(label, `JSON Schema generated have a label as expected`);
        chai_1.expect(jsonSchema.description).to.eql(description, `JSON Schema generated have a description as expected`);
    }
    "can add any valid type to AnySchema"() {
        const addValids = function () {
            anySchema.valid("hello", new Date(), null);
        };
        chai_1.expect(addValids).to.not.throw();
    }
    "can add any invalid type to AnySchema"() {
        const addInvalids = function () {
            anySchema.invalid("hello", new Date(), null);
        };
        chai_1.expect(addInvalids).to.not.throw();
    }
    "SchemaBuilder can make ArraySchemas"() {
        chai_1.expect(arraySchema).to.instanceOf(SZValidator_1.ArraySchema, `Schema is not an instance of ArraySchema`);
    }
    "generate a JSON schema for ArraySchema"() {
        let jsonSchema = arraySchema.getJSONSchema();
        chai_1.expect(jsonSchema).to.eql(arraySchemaJSON, `JSON Schema generated doesn't match expected`);
    }
    "add AnySchema as item schema for ArraySchema"() {
        let jsonSchema = arraySchema.items(arrayAnyItemSchema).getJSONSchema();
        chai_1.expect(jsonSchema).to.eql(arrayAnyItemSchemaJSON, `JSON Schema generated doesn't match expected`);
    }
    "Validate an array"() {
        chai_1.expect(arraySchema.validate(["hello"])).to.eql(["hello"], `ArraySchema can't validate ["hello"]`);
    }
    "SchemaBuilder can make BooleanSchemas"() {
        chai_1.expect(booleanSchema).to.instanceOf(SZValidator_1.BooleanSchema, `Schema is not an instance of BooleanSchema`);
    }
    "generate a JSON schema for BooleanSchema"() {
        let jsonSchema = booleanSchema.getJSONSchema();
        chai_1.expect(jsonSchema).to.eql(booleanSchemaJSON, `JSON Schema generated doesn't match expected`);
    }
};
__decorate([
    test
], SZSchemaBuilderTests.prototype, "SchemaBuilder can make AnySchemas", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "generate a JSON schema for AnySchema", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "Add some properties to AnySchema that are used in JSONSchema", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "can add any valid type to AnySchema", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "can add any invalid type to AnySchema", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "SchemaBuilder can make ArraySchemas", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "generate a JSON schema for ArraySchema", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "add AnySchema as item schema for ArraySchema", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "Validate an array", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "SchemaBuilder can make BooleanSchemas", null);
__decorate([
    test
], SZSchemaBuilderTests.prototype, "generate a JSON schema for BooleanSchema", null);
SZSchemaBuilderTests = __decorate([
    suite
], SZSchemaBuilderTests);
//# sourceMappingURL=SZValidator.suite.js.map