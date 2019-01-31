import { validate } from "../../shared/system/validator/validate";
import usernameValidationRules from "./usernameValidationRules";
export const validateUsername = validate(usernameValidationRules);
