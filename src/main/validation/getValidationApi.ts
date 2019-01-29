import { ValidationApi } from "../../shared/validation/ValidationApi";

export default function getValidationApi(): ValidationApi {
    return { validate: async (username) => {throw Error("foo")} }
}