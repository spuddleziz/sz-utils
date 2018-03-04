import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZArray} from "../JSONSchema/Array";
import {SZAny} from "../JSONSchema/Any";
import {SchemaValidationFailedError} from "../SchemaError";
import {AnySchema} from "./AnySchema";
import {SZNotAllowed} from "../JSONSchema/NotAllowed";

export class FuncSchema extends AnySchema {

  public internalJSONSchema:SZNotAllowed;

  _classMode:boolean = false;

  constructor() {

    super(SZSchemaTypes.Func);

    this.internalJSONSchema = new SZNotAllowed();

  }

  class(enableClassMode?:boolean):this {

    if (enableClassMode === false) {

      this._classMode = false;

    }
    else {

      this._classMode = true;

    }

    return this;

  }

  validate(value:any) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

    if (typeof valStack.value !== "function") {

      throw this.generateError(`notFunction`, "The supplied item is not a function.");

    }

    return AnySchema.postValidate(this, valStack.value, value);

  }

}


