import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZArray} from "../JSONSchema/Array";
import {SZAny} from "../JSONSchema/Any";
import {SchemaValidationErrors, SchemaValidationFailedError} from "../SchemaError";
import {AnySchema} from "./AnySchema";
import {SZAlternatives} from "../JSONSchema/Alternatives";
import {SZValidatorUtils} from "../Utils";

export class AlternativesSchema extends AnySchema {

  public internalJSONSchema:SZAlternatives;

  _alternativeTry:Array<AnySchema> = [];

  constructor(tryAlternatives?:Array<AnySchema>) {

    super(SZSchemaTypes.Alternatives);

    this.internalJSONSchema = new SZAlternatives();

    if (tryAlternatives && Array.isArray(tryAlternatives) && tryAlternatives.length > 0) {

      this.try.apply(this, tryAlternatives);

    }

  }

  try(...alternatives:Array<AnySchema>):this {

    alternatives = SZValidatorUtils.coerceArgs<AnySchema>(alternatives);

    this._alternativeTry = alternatives;

    return this;

  }

  validate(value:any) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

    //need to iterate the try alternatives!

    if (!this._alternativeTry || !Array.isArray(this._alternativeTry) || this._alternativeTry.length === 0) {

      throw this.generateError(`noAlternativesToTry`, "There are no alternative schemas to try.");

    }

    let tryAltLen:number = this._alternativeTry.length;

    let tryAltSchema:AnySchema = null;

    let validationErrors = new SchemaValidationErrors(this);

    for (let tryAltIndex = 0; tryAltIndex < tryAltLen; tryAltIndex++) {

      //try each one for validation.. lets see if we succeed!

      tryAltSchema = this._alternativeTry[tryAltIndex];

      if (tryAltSchema && tryAltSchema instanceof AnySchema) {

        try {

          valStack.value = tryAltSchema.validate(valStack.value);

        }
        catch (ex) {

          ex.message = `tryAlternativeValidationError: ${ex.message}`;

          validationErrors.setIndexError(tryAltIndex, ex, valStack.value);

        }

      }

    }

    return AnySchema.postValidate(this, valStack.value, value);

  }

}


