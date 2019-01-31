import { validate } from "../../shared/system/validator/validate";
import tokenValidationRules from "./tokenValidationRules";
export const validateToken = validate(tokenValidationRules);
