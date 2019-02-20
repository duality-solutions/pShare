import { validate } from "../../shared/system/validator/validate";
import { userNameValidationRules } from "./userNameValidationRules";
export const validateUserName = validate(userNameValidationRules);
