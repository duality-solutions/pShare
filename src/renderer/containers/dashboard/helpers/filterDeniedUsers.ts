import { Enumerable } from "blinq/dist/types/src/Enumerable";
import { GetUserInfo } from "../../../../dynamicdInterfaces/GetUserInfo";
import { DeniedLink } from "../../../../dynamicdInterfaces/DeniedLink";
export const filterDeniedUsers = (users: Enumerable<GetUserInfo>, deniedLinks: DeniedLink[]) =>
    users
        .leftOuterJoin(deniedLinks, user => user.object_full_path, deniedLink => deniedLink.requestor_fqdn, (user, deniedLink) => ({ user, deniedLink }))
        .where(({ deniedLink }) => typeof deniedLink === 'undefined')
        .select(({ user }) => user);
