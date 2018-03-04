

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


@suite class SZNumberSchemaTests {

  @test "Check NumberSchema will accept a number of multiple types"() {
    let numList:Array<number> = [1,-1,0, 427.69,-222.9777];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number(), num)()).eql(num);
    });
  }

  @test "Check NumberSchema will accept integers in integer mode"() {
    let numList:Array<number> = [1,-1,76899922, 23423423,22,-89889234];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().integer(), num)()).eql(num);
    });
  }


  @test "Check NumberSchema will reject non number inputs"() {
    let inList:Array<any> = ["hello", "world", new Date()];
    inList.forEach((inItem) => {
      expect(makeValidator(SZSchemaBuilder.number(), inItem)).to.throw();
    });
  }

  @test "Check NumberSchema will reject positive numbers in negative mode"() {
    let numList:Array<number> = [500.77, 222.66];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().negative(), num)).to.throw();
    });
  }

  @test "Check NumberSchema will reject negative numbers in positive mode"() {
    let numList:Array<number> = [-500.77, -222.66];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().positive(), num)).to.throw();
    });
  }

  @test "Check NumberSchema will reject floats in integer mode"() {
    let numList:Array<number> = [500.77, 222.66];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().integer(), num)).to.throw();
    });
  }

  @test "Check NumberSchema will reject negative numbers/floats in integer & positive mode"() {
    let numList:Array<number> = [500.77, 222.66, -200, -2556.64335666];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().integer().positive(), num)).to.throw();
    });
  }

  @test "Check NumberSchema will reject positive numbers/floats in integer & negative mode"() {
    let numList:Array<number> = [500.77, 222.66, 200, 2556.64335666];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().integer().negative(), num)).to.throw();
    });
  }

  @test "Check NumberSchema will accept numbers under the max limit"() {
    let numList:Array<number> = [-999,0,22,400.27];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().max(400.27), num)()).eql(num);
    });
  }

  @test "Check NumberSchema will accept numbers larger than the min limit"() {
    let numList:Array<number> = [-400.27,0,22,400.27];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().min(-400.27), num)()).eql(num);
    });
  }


  @test "Check NumberSchema will reject numbers over the max limit"() {
    let numList:Array<number> = [400.28, 999, 999999.99999999];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().max(400.27), num)).to.throw();
    });
  }

  @test "Check NumberSchema will reject numbers under the min limit"() {
    let numList:Array<number> = [-9999, -80, 0, 69];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().min(70), num)).to.throw();
    });
  }

  @test "Check NumberSchema will accept numbers under the less limit"() {
    let numList:Array<number> = [-999,0,22,400.26];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().less(400.27), num)()).eql(num);
    });
  }

  @test "Check NumberSchema will accept numbers larger than the greater limit"() {
    let numList:Array<number> = [-400.26,0,22,400.27];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().greater(-400.27), num)()).eql(num);
    });
  }


  @test "Check NumberSchema will reject numbers over the less limit"() {
    let numList:Array<number> = [400.27, 999, 999999.99999999];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().less(400.27), num)).to.throw();
    });
  }

  @test "Check NumberSchema will reject numbers under the greater limit"() {
    let numList:Array<number> = [-9999, -80, 0, 70];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().greater(70), num)).to.throw();
    });
  }



  @test "Check NumberSchema will accept numbers that are multiples of the multiple limit"() {
    let numList:Array<number> = [2,64,128,1024];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().multiple(2), num)()).eql(num);
    });
  }

  @test "Check NumberSchema will reject numbers that are not multiples of the multiple limit"() {
    let numList:Array<number> = [2,64,128,1024];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().multiple(3), num)).to.throw();
    });
  }

  @test "Check NumberSchema will accept numbers that are of the correct precision with convert mode disabled"() {
    let numList:Array<number> = [11, 11.11, 11.1111];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().options({ convert : false }).precision(4), num)()).eql(num);
    });
  }

  @test "Check NumberSchema will reject numbers that are of the incorrect precision with convert mode disabled"() {
    let numList:Array<number> = [11.11111, 9.00000002, 6546456456.23492873429384792347];
    numList.forEach((num) => {
      expect(makeValidator(SZSchemaBuilder.number().options({ convert : false }).precision(4), num)).to.throw();
    });
  }

  @test "Check NumberSchema will accept and convert numbers to the correct precision."() {
    let numList:Array<number> = [11, 11.11, 11.1111, 8976234876234.234982734927834, 23723.1231231, -500, 0, 0.00004, -867486734.9873497834];
    numList.forEach((num) => {
      let exp = (num.toString().indexOf(".") === -1 ? num : parseFloat(num.toFixed(4)));
      expect(makeValidator(SZSchemaBuilder.number().precision(4), num)()).eql(exp);
    });
  }

}
