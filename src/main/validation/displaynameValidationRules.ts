import { ValidationTest } from "../../shared/system/validator/ValidationTest";

const isValidDisplayname = (value: string) => /^[A-Za-z0-9]+$/.test(value);

const displaynameValidationRules: ValidationTest<string>[] = [
    {
        test: isValidDisplayname,
        message: "value should be at least 1 alphanumeric",
        
    }
];

export default displaynameValidationRules