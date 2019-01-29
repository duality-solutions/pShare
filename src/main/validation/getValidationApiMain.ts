import { ValidationApi } from "../../shared/validation/ValidationApi";

export default function getValidationApiMain(): ValidationApi {
    return { validate: async (username) => {throw Error("foo")} }
}