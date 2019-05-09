import { navSaga } from "./navSaga/navSaga";
import { beginCreateBdapAccountSaga } from "./beginCreateBdapAccountSaga";
import { searchTextDebounceSaga } from "./searchTextDebounceSaga";

export const getRootSaga = () => {
    return [navSaga, beginCreateBdapAccountSaga, searchTextDebounceSaga]
}