// Reference mocha-typescript's global definitions:
/// <reference path="../../node_modules/mocha-typescript/globals.d.ts" />
import {StringSchema} from "../SZValidator/SZSchemas/StringSchema";

let colors = require('mocha/lib/reporters/base').colors;
colors['diff gutter'] = 92;
colors['diff added'] = 32;
colors['diff removed'] = 31;
colors['error stack'] = 92;
colors.progress = 92;
colors.runway = 92;
colors.fast = 92;
colors.pass = 92;
import * as Promise from "bluebird";
import { assert, expect,  } from "chai";
import {AnySchema, ArraySchema, BooleanSchema, SZSchemaBuilder} from "../SZValidator";

let anySchema:AnySchema = SZSchemaBuilder.any();
let anySchemaJSON:any = { type: [ 'array', 'boolean', 'number', 'object', 'string', 'null' ] };

let arraySchema:ArraySchema = SZSchemaBuilder.array();
let arraySchemaJSON:any = { type: 'array' };
let arrayAnyItemSchema:AnySchema = SZSchemaBuilder.any();
let arrayAnyItemSchemaJSON:any = { type: 'array', items : anySchemaJSON };

let stringSchemaHello:StringSchema = SZSchemaBuilder.string().regex(/^hello$/);
let stringSchemaJSON:any = { type: "string" };
let stringSchemaHelloJSON:any = { type: "string", pattern: "^hello$" };


let booleanSchema:BooleanSchema = SZSchemaBuilder.boolean();
let booleanSchemaJSON:any = { type: 'boolean' };
let booleanFalsey:Array<any> = ["n", "false", 0];
let booleanTruthy:Array<any> = ["y", "true", 1];

@suite class SZSchemaBuilderTests  {
  @test "SchemaBuilder can make AnySchemas"() {
    expect(anySchema).to.instanceOf(AnySchema, `Schema is not an instance of AnySchema`);
  }
  @test "generate a JSON schema for AnySchema"() {
    let jsonSchema = anySchema.getJSONSchema();
    expect(jsonSchema).to.eql(anySchemaJSON, `JSON Schema generated doesn't match expected`);
  }
  @test "Add some properties to AnySchema that are used in JSONSchema"() {
    let description = "Test Description";
    let label = "Test Label";
    let jsonSchema = anySchema.description(description).label(label).getJSONSchema();
    expect(jsonSchema.title).to.eql(label, `JSON Schema generated have a label as expected`);
    expect(jsonSchema.description).to.eql(description, `JSON Schema generated have a description as expected`);
  }
  @test "can add any valid type to AnySchema"() {
    const addValids = function() {
      anySchema.valid("hello", new Date(), null);
    };
    expect(addValids).to.not.throw();
  }
  @test "can add any invalid type to AnySchema"() {
    const addInvalids = function() {
      anySchema.invalid("hello", new Date(), null);
    };
    expect(addInvalids).to.not.throw();
  }
  @test "SchemaBuilder can make ArraySchemas"() {
    expect(arraySchema).to.instanceOf(ArraySchema, `Schema is not an instance of ArraySchema`);
  }
  @test "generate a JSON schema for ArraySchema"() {
    let jsonSchema = arraySchema.getJSONSchema();
    expect(jsonSchema).to.eql(arraySchemaJSON, `JSON Schema generated doesn't match expected`);
  }
  @test "add AnySchema as item schema for ArraySchema"() {
    let jsonSchema = arraySchema.items(arrayAnyItemSchema).getJSONSchema();
    expect(jsonSchema).to.eql(arrayAnyItemSchemaJSON, `JSON Schema generated doesn't match expected`);
  }
  @test "Validate an array"() {
    expect(arraySchema.validate(["hello"])).to.eql(["hello"], `ArraySchema can't validate ["hello"]`);
  }
  @test "SchemaBuilder can make BooleanSchemas"() {
    expect(booleanSchema).to.instanceOf(BooleanSchema, `Schema is not an instance of BooleanSchema`);
  }
  @test "generate a JSON schema for BooleanSchema"() {
    let jsonSchema = booleanSchema.getJSONSchema();
    expect(jsonSchema).to.eql(booleanSchemaJSON, `JSON Schema generated doesn't match expected`);
  }

}
