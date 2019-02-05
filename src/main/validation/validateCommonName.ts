import { validate } from "../../shared/system/validator/validate";
import commonNameValidationRules from "./commonNameValidationRules";
export const validateCommonName = validate(commonNameValidationRules);
