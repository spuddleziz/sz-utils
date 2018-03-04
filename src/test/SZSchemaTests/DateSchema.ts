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

const dateSchema = SZSchemaBuilder.date().required();
const validateValueFunc = function () {
  return dateSchema.validate(this);
};

function makeValidator(schema:AnySchema, value:any) {

  return function (value) {

    return this.validate(value);

  }.bind(schema, value);

}


@suite class SZDateSchemaTests  {

  @test "Check DateSchema will accept a javascript date object"() {
    let date = new Date();
    expect(makeValidator(SZSchemaBuilder.date(), date)()).eql(date);
  }

  @test "Check DateSchema will reject a javascript date object that isnt larger than or equal to a mimimum"() {
    let date = new Date(0);
    expect(makeValidator(SZSchemaBuilder.date().min(10), date)).to.throw();
  }

  @test "Check DateSchema will allow a javascript date object that is larger than or equal to a mimimum"() {
    let date = new Date(11);
    expect(makeValidator(SZSchemaBuilder.date().min(10), date)()).eql(date);
  }

  @test "Check DateSchema will reject a javascript date object that isnt smaller than or equal to a maximum"() {
    let date = new Date(11);
    expect(makeValidator(SZSchemaBuilder.date().max(10), date)).to.throw();
  }

  @test "Check DateSchema will accept a javascript date object that is smaller than or equal to a maximum"() {
    let date = new Date(10);
    expect(makeValidator(SZSchemaBuilder.date().max(10), date)()).eql(date);
  }

  @test "Check DateSchema will accept a javascript date object and return a moment object"() {
    let date = new Date();
    expect(makeValidator(SZSchemaBuilder.date().moment(), date)()).eql(moment(date.getTime()));
  }

  @test "Check DateSchema will accept a javascript date object and return a javascript timestamp"() {
    let date = new Date();
    expect(makeValidator(SZSchemaBuilder.date().timestamp(), date)()).eql(date.getTime());
  }

  @test "Check DateSchema will accept a string and return a javascript timestamp"() {
    let str = "1995-12-25";
    let date = moment(str);
    expect(makeValidator(SZSchemaBuilder.date().timestamp(), str)()).eql(date.valueOf());
  }

  @test "Check DateSchema will accept a ISO:8601 string and return a javascript timestamp"() {
    let str = "2010-01-01T05:06:07";
    let date = moment("2010-01-01T05:06:07", moment.ISO_8601);
    expect(makeValidator(SZSchemaBuilder.date().timestamp(), str)()).eql(date.valueOf());
  }

  @test "Check DateSchema will accept a javascript date object and return a the same when convert mode is disabled"() {
    let date = new Date();
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }), date)()).eql(date);
  }

  @test "Check DateSchema will accept a javascript timestamp and return a the same when convert mode is disabled"() {
    let date = new Date().getTime();
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }).timestamp(), date)()).eql(date);
  }

  @test "Check DateSchema will reject a javascript date object when convert mode is disabled and timestamp mode is on."() {
    let date = new Date();
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }).timestamp(), date)).to.throw();
  }

  @test "Check DateSchema will reject a moment object when convert mode is disabled and timestamp mode is on."() {
    let date = moment(new Date());
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }).timestamp(), date)).to.throw();
  }

  @test "Check DateSchema will reject a string when convert mode is disabled and timestamp mode is on."() {
    let date = "1995-12-25";
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }).timestamp(), date)).to.throw();
  }

  @test "Check DateSchema will accept a moment object when convert mode is disabled and moment mode is on."() {
    let date = moment(new Date());
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }).moment(), date)()).eql(date);
  }

  @test "Check DateSchema will reject a javascript date object when convert mode is disabled and moment mode is on."() {
    let date = new Date();
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }).moment(), date)).to.throw();
  }

  @test "Check DateSchema will reject a javascript timestamp when convert mode is disabled and moment mode is on."() {
    let date = new Date().getTime();
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }).moment(), date)).to.throw();
  }

  @test "Check DateSchema will reject a string when convert mode is disabled and moment mode is on."() {
    let date = "1995-12-25";
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }).moment(), date)).to.throw();
  }

  @test "Check DateSchema will accept a javascript date object when convert mode is disabled."() {
    let date = new Date();
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }), date)()).eql(date);
  }

  @test "Check DateSchema will reject a moment object when convert mode is disabled."() {
    let date = moment(new Date());
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }), date)).to.throw();
  }

  @test "Check DateSchema will reject a javascript timestamp when convert mode is disabled."() {
    let date = new Date().getTime();
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }), date)).to.throw();
  }

  @test "Check DateSchema will reject a string when convert mode is disabled."() {
    let date = "1995-12-25";
    expect(makeValidator(SZSchemaBuilder.date().options({ convert : false }), date)).to.throw();
  }


}
