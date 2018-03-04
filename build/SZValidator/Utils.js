"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
class SZValidatorUtils {
    static coerceArgs(inArgs) {
        assert(Array.isArray(inArgs) && inArgs.length >= 1, `Cannot coerce arguments from an empty array`);
        if (inArgs.length === 1) {
            if (Array.isArray(inArgs[0])) {
                return inArgs[0];
            }
            else {
                return [inArgs[0]];
            }
        }
        return inArgs;
    }
}
exports.SZValidatorUtils = SZValidatorUtils;
//# sourceMappingURL=Utils.js.map