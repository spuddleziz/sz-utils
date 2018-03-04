import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZArray} from "../JSONSchema/Array";
import {SZAny} from "../JSONSchema/Any";
import {SchemaValidationFailedError} from "../SchemaError";

export class AnySchema extends BaseSchema<any> {

  public internalJSONSchema:SZAny;

  constructor(inType?:SZSchemaTypes) {

    super(inType || SZSchemaTypes.Any);

    this.internalJSONSchema = new SZAny();

  }

  validate(value:any) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

    return AnySchema.postValidate(this, valStack.value, value);

  }

}


