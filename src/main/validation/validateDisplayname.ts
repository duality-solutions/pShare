import { validate } from "../../shared/system/validator/validate";
import displaynameValidationRules from "./displaynameValidationRules";
export const validateDisplayname = validate(displaynameValidationRules);
