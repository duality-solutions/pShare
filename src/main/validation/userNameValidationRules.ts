import { ValidationTest } from "../../shared/system/validator/ValidationTest";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { RpcClient } from "../RpcClient";

const isLongEnough = (client: RpcClient, value: string) => value.length >= 3;
const isValidCharacters = (client: RpcClient, value: string) => /^[a-z]+$/.test(value);
const userNameDoesNotExist = async (client: RpcClient, value: string) => {

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

export const userNameValidationRules: ValidationTest<string>[] = [
    {
        test: isLongEnough,
        message: "User name must be at least 3 characters long",
        testsOnSuccess: [
            {
                test: isValidCharacters,
                message: "User name may only contain smaller case letters",
                testsOnSuccess: [{
                    test: userNameDoesNotExist,
                    message: "User name is already taken"
                }]
            }
        ]
    }
];

