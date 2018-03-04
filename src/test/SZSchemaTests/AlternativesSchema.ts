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
import {BinarySchemaEncodingOption} from "../../SZValidator/SZSchemas/BinarySchema";

function makeValidator(schema:AnySchema, value:any) {

  return function (value) {

    return this.validate(value);

  }.bind(schema, value);

}


@suite class SZAlternativesSchemaTests {

  @test "Check AlternativesSchema will accept a simple 2 rules try alternative."() {
    expect(makeValidator(SZSchemaBuilder.alternatives([

      SZSchemaBuilder.string().regex(/^atempt one$/),
      SZSchemaBuilder.number().integer()

    ]), 5)()).eql(5);
  }
}
