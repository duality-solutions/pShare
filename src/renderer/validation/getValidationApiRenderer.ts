import { ValidationApi } from "../../shared/validation/ValidationApi";
import getProxyForChannel from "../../shared/proxy/getProxyForChannel";


export default function getValidationApiMain(): ValidationApi {
    return getProxyForChannel<ValidationApi>("validationApi");
}