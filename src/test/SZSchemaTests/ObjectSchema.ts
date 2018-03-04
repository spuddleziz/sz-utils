// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />


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

const objectSchema = SZSchemaBuilder.object().required();
const validateValueFunc = function () {
  return objectSchema.validate(this);
};

function makeValidator(schema:AnySchema, value:any) {

  return function (value) {

    return this.validate(value);

  }.bind(schema, value);

}


class TestType {

  public testing:string = "hello";

  constructor() {



  }

}

@suite class SZObjectSchemaTests  {

  @test "Check ObjectSchema will accept single property"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string().required()
    }), {
      test : "hello"
    })()).eql({
      test : "hello"
    });
  }

  @test "Check ObjectSchema will accept multiple properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string().required(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required())
    }), {
      test : "hello",
      another : ["hello", "world"]
    })()).eql({
      test : "hello",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will accept patterned properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string().required().strip(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required())
    }).pattern(/^vann:[A-Za-z0-9_\-]+$/, SZSchemaBuilder.string().strip()), {
      test : "hello",
      another : ["hello", "world"],
      "vann:test99" : "wow"
    })()).eql({
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will reject forbidden properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string().required().strip(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required())
    }).pattern(/^vann:[A-Za-z0-9_\-]+$/, SZSchemaBuilder.string().strip()).forbiddenKeys("hello_world"), {
      test : "hello",
      hello_world: true,
      another : ["hello", "world"],
      "vann:test99" : "wow"
    })).to.throw();
  }

  @test "Check ObjectSchema will confirm and properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string().required(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string().required()
    }).and("test", "another", "foobar"), {
      test : "hello",
      another : ["hello", "world"],
      foobar: "hello"
    })()).eql({
      test : "hello",
      another : ["hello", "world"],
      foobar: "hello"
    });
  }

  @test "Check ObjectSchema will reject missing and properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string().required(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string().required()
    }).and("test", "another", "foobar"), {
      test : "hello",
      foobar: "hello"
    })).to.throw();
  }

  @test "Check ObjectSchema will confirm or required type properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string().required(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string().required()
    }).or("test", "another"), {
      test : "hello",
      foobar: "hello"
    })()).eql({
      test : "hello",
      foobar: "hello"
    });
  }

  @test "Check ObjectSchema will reject missing or required type properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).or("test", "another"), {
      foobar: "hello"
    })).to.throw();
  }

  @test "Check ObjectSchema will confirm xor required type properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).xor("test", "another"), {
      test : "hello",
      foobar: "hello",
      //another : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello"
    });
  }

  @test "Check ObjectSchema will reject missing xor required type properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).xor("test", "another"), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }


  @test "Check ObjectSchema will confirm nand required type properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).nand("test", "another"), {
      test : "hello",
      foobar: "hello",
      //another : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello"
    });
  }

  @test "Check ObjectSchema will reject nand required type properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).nand("test", "another"), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }


  @test "Check ObjectSchema will confirm required properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).requiredKeys("test", "another"), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    });
  }


  @test "Check ObjectSchema will reject required properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).requiredKeys("test", "another"), {
      test : "hello",
      foobar: "hello"
    })).to.throw();
  }



  @test "Check ObjectSchema will allow unknown properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).unknown(true), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"],
      what : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"],
      what : ["hello", "world"]
    });
  }


  @test "Check ObjectSchema will reject unknown properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"],
      what : ["hello", "world"]
    })).to.throw();
  }

  @test "Check ObjectSchema will require a minimum number of properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).min(2), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will reject a minimum number of properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).min(2), {
      test : "hello"
    })).to.throw();
  }

  @test "Check ObjectSchema will require a maximum number of properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).max(2), {
      test : "hello",
      foobar: "hello"
    })()).eql({
      test : "hello",
      foobar: "hello"
    });
  }

  @test "Check ObjectSchema will reject a maximum number of properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).max(2), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }

  @test "Check ObjectSchema will require an exact length of properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).length(2), {
      test : "hello",
      foobar: "hello"
    })()).eql({
      test : "hello",
      foobar: "hello"
    });
  }

  @test "Check ObjectSchema will reject an incorrect number of properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).length(2), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }

  @test "Check ObjectSchema will rename a key/property"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).rename("foobar", "hello"), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      test : "hello",
      hello: "hello",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will reject renaming a key/property when it already exists"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string(),
      hello: SZSchemaBuilder.string()
    }).rename("foobar", "hello"), {
      test : "hello2",
      foobar: "hello",
      another : ["hello", "world"],
      hello : "hello2"
    })).to.throw();
  }

  @test "Check ObjectSchema will rename a key/property if it already exists and override is enabled"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string(),
      hello: SZSchemaBuilder.string()
    }).rename("foobar", "hello", { override : true }), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"],
      hello: "hello2"
    })()).eql({
      test : "hello",
      hello: "hello",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will rename a key/property multiple times"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).rename("foobar", "hello", { multiple : true }).rename("test", "hello", { multiple : true }), {
      test : "hello2",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      hello: "hello",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will reject renaming a key/property multiple times when no options are passed"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).rename("foobar", "hello").rename("test", "hello"), {
      test : "hello2",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }

  @test "Check ObjectSchema will rename a key/property but ignore undefined values"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).rename("foobar", "hello", { ignoreUndefined : true }), {
      test : "hello2",
      foobar: undefined,
      another : ["hello", "world"]
    })()).eql({
      test : "hello2",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will rename a key/property but ignore undefined values however this will set undefined on the from key"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).rename("foobar", "hello", { ignoreUndefined : true, setUndefinedOnFromKey : true }), {
      test : "hello2",
      foobar: undefined,
      another : ["hello", "world"]
    })()).eql({
      test : "hello2",
      foobar: undefined,
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will rename a key/property and alias the value back to the original key"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).rename("foobar", "hello", { alias : true }), {
      test : "hello2",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      hello: "hello",
      foobar: "hello",
      test : "hello2",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will rename a key/property with undefined value and alias the value back to the original key"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).rename("foobar", "hello", { alias : true }), {
      test : "hello2",
      foobar: undefined,
      another : ["hello", "world"]
    })()).eql({
      hello: undefined,
      foobar: undefined,
      test : "hello2",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will rename a key/property and set the original key to undefined"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).rename("foobar", "hello", { setUndefinedOnFromKey : true }), {
      test : "hello2",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      hello: "hello",
      foobar: undefined,
      test : "hello2",
      another : ["hello", "world"]
    });
  }


  @test "Check ObjectSchema will require 'with' properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).with("test", "foobar", "another"), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    });
  }


  @test "Check ObjectSchema will reject missing 'with' properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).with("test", "foobar", "another"), {
      test : "hello",
      foobar: "hello"
    })).to.throw();
  }


  @test "Check ObjectSchema will ensure there are no 'without' properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).without("test", "foobar", "another"), {
      test : "hello"
    })()).eql({
      test : "hello"
    });
  }


  @test "Check ObjectSchema will reject when there are 'without' properties"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).without("test", "foobar", "another"), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }


  @test "Check ObjectSchema will ensure that properties/keys with reference based assertions succeed"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).assert("test", "foobar"), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    });
  }


  @test "Check ObjectSchema will ensure that properties/keys with schema based assertions succeed"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).assert("test", SZSchemaBuilder.string().regex(/^hello$/)), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    });
  }


  @test "Check ObjectSchema will ensure that properties/keys with reference based assertions and non equal values will reject"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).assert("test", "foobar"), {
      test : "hello",
      foobar: "hello2",
      another : ["hello", "world"]
    })).to.throw();
  }


  @test "Check ObjectSchema will ensure that properties/keys with schema based assertions and non equal values will reject"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).assert("test", SZSchemaBuilder.string().regex(/^hello2$/)), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }

  @test "Check ObjectSchema will validate schemas itself"() {
    let schema = SZSchemaBuilder.string();
    expect(makeValidator(SZSchemaBuilder.object().schema(), schema)()).eql(schema);
  }

  @test "Check ObjectSchema will reject schemas if schema mode isn't enabled"() {
    let schema = SZSchemaBuilder.string();
    expect(makeValidator(SZSchemaBuilder.object(), schema)).to.throw();
  }

  @test "Check ObjectSchema will validate javascript classes/objects"() {
    let tempObj = new TestType();
    expect(makeValidator(SZSchemaBuilder.object().type(TestType), tempObj)()).eql({ testing : "hello" });
  }

  @test "Check ObjectSchema will reject invalid javascript classes/objects"() {
    expect(makeValidator(SZSchemaBuilder.object().type(TestType), new Date())).to.throw();
  }


  @test "Check ObjectSchema will allow valid objects"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).valid({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    }), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    });
  }


  @test "Check ObjectSchema will reject invalid objects"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).invalid({
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    }), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw()
  }


  @test "Check ObjectSchema will make keys optional after they may have been required"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string().required(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).optionalKeys("test"), {
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      foobar: "hello",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will allow the extension of an existing schema"() {
    expect(makeValidator(SZSchemaBuilder.object({
      //test : SZSchemaBuilder.string().required(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).keys({

      hello_world : SZSchemaBuilder.string().required()

    }), {
      hello_world: "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })()).eql({
      hello_world: "hello",
      foobar: "hello",
      another : ["hello", "world"]
    });
  }

  @test "Check ObjectSchema will reject if an extension with required keys is added and the supplied value doesnt have the required key"() {
    expect(makeValidator(SZSchemaBuilder.object({
      //test : SZSchemaBuilder.string().required(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).keys({

      hello_world : SZSchemaBuilder.string().required()

    }), {
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }



  @test "Large multi schema object test"() {
    expect(makeValidator(SZSchemaBuilder.object({
      test : SZSchemaBuilder.string(),
      another : SZSchemaBuilder.array().items(SZSchemaBuilder.string().required()),
      foobar: SZSchemaBuilder.string()
    }).assert("test", SZSchemaBuilder.string().regex(/^hello2$/)), {
      test : "hello",
      foobar: "hello",
      another : ["hello", "world"]
    })).to.throw();
  }


}
