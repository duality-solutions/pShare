import { ValidationTest } from "../../shared/system/validator/ValidationTest";

const isValidDisplayname = (value: string) => /^[A-Za-z0-9]+$/.test(value);

const displaynameValidationRules: ValidationTest<string>[] = [
    {
        test: isValidDisplayname,
        message: "Value may only contain letters and numbers.",
        
    }
];

export default displaynameValidationRules