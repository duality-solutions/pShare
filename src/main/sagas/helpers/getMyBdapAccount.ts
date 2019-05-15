import { select, call } from "redux-saga/effects";
import { MainRootState } from "../../reducers";
import { UserState } from "../../../shared/reducers/user";
import { RpcClient } from "../../RpcClient";
import { entries } from "../../../shared/system/entries";
import { BdapAccount } from "../../../dynamicdInterfaces/BdapAccount";
export const getMyBdapAccount = (rpcClient: RpcClient) => call(function* () {
    const myBdapAccountsResponse: Record<string, BdapAccount> = yield call(() => rpcClient.command("mybdapaccounts"));
    const myBdapAccounts = entries(myBdapAccountsResponse).select(([, v]) => v);
    const user: UserState = yield select((state: MainRootState) => state.user);
    const myBdapAccount = myBdapAccounts.singleOrDefault(acc => acc.object_id === user.userName);
    return myBdapAccount;
});
