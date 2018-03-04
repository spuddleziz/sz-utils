import { AnySchema } from "./SZSchemas/AnySchema";
import {ArraySchema} from "./SZSchemas/ArraySchema";
import {BooleanSchema} from "./SZSchemas/BooleanSchema";
import {assign, clone} from "lodash";
import {BinarySchema} from "./SZSchemas/BinarySchema";
import {DateSchema} from "./SZSchemas/DateSchema";
import {StringSchema} from "./SZSchemas/StringSchema";
import {ObjectSchema} from "./SZSchemas/ObjectSchema";
import {IDictionary} from "../IDictionary";
import {NumberSchema} from "./SZSchemas/NumberSchema";
import {FuncSchema} from "./SZSchemas/FuncSchema";
import {AlternativesSchema} from "./SZSchemas/AlternativesSchema";

function createSchemaFromRoot(rootFN:any) {



}

export interface ISZSchemaBuilderOptions {

  convert:boolean;

}

class SZSchemaBuilderOptions implements ISZSchemaBuilderOptions {

  convert:boolean = true;

  constructor(inOpts?:ISZSchemaBuilderOptions) {

    if (inOpts && Object.keys(inOpts).length > 0) {

      assign(this, inOpts);

    }

  }

  set(inOpts:ISZSchemaBuilderOptions) {

    if (inOpts && Object.keys(inOpts).length > 0) {

      assign(this, inOpts);

    }

  }

}

const SZ_BUILDER_OPTIONS = new SZSchemaBuilderOptions();


export class SZSchemaBuilder {

  public static getOptions():ISZSchemaBuilderOptions {

    return SZ_BUILDER_OPTIONS;

  }

  public static setOptions(inOpts:ISZSchemaBuilderOptions) {

    SZ_BUILDER_OPTIONS.set(inOpts);

  }

  public static any():AnySchema {

    return new AnySchema();

  }

  public static array():ArraySchema {

    return new ArraySchema();

  }

  public static boolean():BooleanSchema {

    return new BooleanSchema();

  }

  public static binary():BinarySchema {

    return new BinarySchema();

  }

  public static date():DateSchema {

    return new DateSchema();

  }

  public static func():FuncSchema {

    return new FuncSchema();

  }

  public static number():NumberSchema {

    return new NumberSchema();

  }

  public static object(objectSchemaMap?:IDictionary<AnySchema>):ObjectSchema {

    return new ObjectSchema(objectSchemaMap);

  }

  public static string():StringSchema {

    return new StringSchema();

  }

  public static alternatives(altSchemas?:Array<AnySchema>):AlternativesSchema {

    return new AlternativesSchema(altSchemas);

  }

}
