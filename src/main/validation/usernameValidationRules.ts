import { ValidationTest } from "../../shared/system/validator/ValidationTest";
import { getBitcoinClient } from "../getBitcoinClient";

const isValidUsername = (value: string) => /^[A-Za-z0-9]+$/.test(value);
const usernameDoesNotExist = async (value: string) => {
    const client = await getBitcoinClient()
    let userInfo: GetUserInfo;
    try {
        userInfo = await client.command("getuserinfo", value)

    } catch (err) {
        console.log(err)

        if (/^BDAP_SELECT_PUBLIC_USER_RPC_ERROR: ERRCODE: 3600/.test(err.message)) {
            return true;
        }
        if (/^connect ECONNREFUSED/.test(err.message)) {
            throw Error("Could not connect, try again")
        }
        throw err
    }
    if (typeof userInfo === 'undefined') {
        return true
    }
    return false
}

const usernameValidationRules: ValidationTest<string>[] = [
    {
        test: isValidUsername,
        message: "value should be at least 1 alphanumeric",
        testsOnSuccess: [{
            test: usernameDoesNotExist,
            message: "username is already taken"
        }]
    }
];

export default usernameValidationRules