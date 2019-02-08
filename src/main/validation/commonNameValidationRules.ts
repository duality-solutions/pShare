import { ValidationTest } from "../../shared/system/validator/ValidationTest";

const isValidCommonName = (value: string) => /^[A-Za-z0-9]+$/.test(value);

export const commonNameValidationRules: ValidationTest<string>[] = [
    {
        test: isValidCommonName,
        message: "Value may only contain letters and numbers.",
        
    }
];

