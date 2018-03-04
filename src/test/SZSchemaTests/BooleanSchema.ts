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


let booleanFalsey:Array<any> = ["n", "false", 0];
let booleanTruthy:Array<any> = ["y", "true", 1];
let booleanSchema = SZSchemaBuilder.boolean().truthy(booleanTruthy).falsey(booleanFalsey);

function makeValidator(schema:AnySchema, value:any) {

  return function (value) {

    return this.validate(value);

  }.bind(schema, value);

}

@suite class SZBooleanSchemaTests {

  @test "Validate a boolean"() {

    expect(makeValidator(SZSchemaBuilder.boolean(), true)()).to.eql(true, `BooleanSchema can't validate true`);
    expect(makeValidator(SZSchemaBuilder.boolean(),false)()).to.eql(false, `BooleanSchema can't validate false`);
  }

  @test "Add Truth/Falsey values and check they can be validated"() {
    let booleanSchema = SZSchemaBuilder.boolean().truthy(booleanTruthy).falsey(booleanFalsey);
    expect(booleanSchema.validate("y")).to.eql(true, `BooleanSchema can't validate y -> true`);
    expect(booleanSchema.validate("true")).to.eql(true, `BooleanSchema can't validate "true" -> true`);
    expect(booleanSchema.validate(1)).to.eql(true, `BooleanSchema can't validate 1 -> true`);
    expect(booleanSchema.validate("n")).to.eql(false, `BooleanSchema can't validate "n" -> false`);
    expect(booleanSchema.validate("false")).to.eql(false, `BooleanSchema can't validate "false" -> false`);
    expect(booleanSchema.validate(0)).to.eql(false, `BooleanSchema can't validate 0 -> false`);
  }
  @test "Check truth/false values with insensitive mode off throw"() {
    const checkInvalidTruthy = function() {
      booleanSchema.validate("TRUE");
    };
    expect(checkInvalidTruthy).to.throw();
    const checkInvalidFalsey = function() {
      booleanSchema.validate("FALSE");
    };
    expect(checkInvalidFalsey).to.throw();
  }
  @test "Validate a boolean with insensitive mode on"() {
    booleanSchema = booleanSchema.insensitive();
    expect(booleanSchema.validate("TRUE")).to.eql(true, `BooleanSchema can't validate "TRUE" -> true with insensitive mode on`);
    expect(booleanSchema.validate("FALSE")).to.eql(false, `BooleanSchema can't validate "FALSE" -> false with insensitive mode on`);
  }
}
