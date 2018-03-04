// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />


import * as moment from "moment";

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
import {AnySchema, ArraySchema, BooleanSchema, SZSchemaBuilder, StringSchemaIPRuleOptionsCIDR,
  StringSchemaIPRuleOptionsIPVersion, StringSchema } from "../../SZValidator";


function makeValidator(schema:AnySchema, value:any) {

  return function (value) {

    return this.validate(value);

  }.bind(schema, value);

}

let orderedValidatorSchema = SZSchemaBuilder.array().items(SZSchemaBuilder.string())
  .ordered(SZSchemaBuilder.string().regex(/^first$/));

@suite class SZArraySchemaTests {

  @test "Validate an array"() {

    expect(makeValidator(SZSchemaBuilder.array().items(SZSchemaBuilder.string()), ["hello"])()).eql(["hello"]);

  }
  @test "Check ArraySchema can add ordered schemas and validate items in order"() {
    let arr = ["first", "hello"];
    expect(makeValidator(orderedValidatorSchema, arr)())
      .to.eql(arr, `JSON Schema generated doesn't match expected`);
  }
  @test "Check ArraySchema will reject ordered items"() {
    let arr = ["not", "hello"];
    expect(makeValidator(orderedValidatorSchema, arr))
      .to.throw();
  }


  @test "Check ArraySchema can handle sparse arrays"() {
    let arr = [];
    expect(makeValidator(SZSchemaBuilder.array().items(SZSchemaBuilder.string()).sparse(), arr)())
      .to.eql(arr, `JSON Schema generated doesn't match expected`);
  }


  @test "Check ArraySchema will reject sparse arrays if the shcmea isnt configured for them"() {
    let arr = [];
    expect(makeValidator(SZSchemaBuilder.array().items(SZSchemaBuilder.string()), arr))
      .to.throw();
  }


  @test "Check ArraySchema can handle single array items and expand them to an array"() {
    let arr = ["hello"];
    expect(makeValidator(SZSchemaBuilder.array().items(SZSchemaBuilder.string()).single(), arr[0])())
      .to.eql(arr, `JSON Schema generated doesn't match expected`);
  }

  @test "Check ArraySchema will reject single array items when single mode isnt enabled"() {
    let arr = ["hello"];
    expect(makeValidator(SZSchemaBuilder.array().items(SZSchemaBuilder.string()), arr[0]))
      .to.throw();
  }

}
