import * as SZPromise from "./SZPromise";
import * as SZValidator from "./SZValidator";
import * as ImportBluebird from "bluebird";

export const Promise = SZPromise.P;
export const Bluebird = ImportBluebird;
export const Validator = SZValidator;
