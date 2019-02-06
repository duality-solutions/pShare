import { navSaga } from "./navSaga";
import { beginCreateBdapAccountSaga } from "./beginCreateBdapAccountSaga";

export const getRootSaga = () => {
    return [navSaga, beginCreateBdapAccountSaga]
}