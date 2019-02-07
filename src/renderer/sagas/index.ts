import { navSaga } from "./navSaga/navSaga";
import { beginCreateBdapAccountSaga } from "./beginCreateBdapAccountSaga";

export const getRootSaga = () => {
    return [navSaga, beginCreateBdapAccountSaga]
}