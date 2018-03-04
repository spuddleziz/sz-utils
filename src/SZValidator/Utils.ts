import * as assert from "assert";

export class SZValidatorUtils {

  public static coerceArgs<T>(inArgs:Array<T>):Array<T> {

    assert(Array.isArray(inArgs) && inArgs.length >= 1, `Cannot coerce arguments from an empty array`);

    if (inArgs.length === 1) {

      if (Array.isArray(inArgs[0])) {

        return <any>inArgs[0];

      }
      else {

        return [inArgs[0]]

      }

    }

    return inArgs;

  }

}
