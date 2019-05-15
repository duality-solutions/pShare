import { RpcClient } from "../../RpcClient";
import { call } from "redux-saga/effects";
import { BdapAccount } from "../../../dynamicdInterfaces/BdapAccount";
import { entries } from "../../../shared/system/entries";
export const getFirstBdapAccount = (rpcClient: RpcClient) => call(function* () {
    const myBdapAccountsResponse: Record<string, BdapAccount> = yield call(() => rpcClient.command("mybdapaccounts"));
    const myBdapAccounts = entries(myBdapAccountsResponse).select(([, v]) => v);
    const myBdapAccount = myBdapAccounts.firstOrDefault();
    return myBdapAccount;
});
