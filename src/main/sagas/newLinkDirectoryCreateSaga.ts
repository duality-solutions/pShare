import { app } from 'electron';
import * as path from 'path'
import * as fsExtra from 'fs-extra'
import { call, takeEvery } from 'redux-saga/effects';
import { createAsyncQueue } from '../../shared/system/createAsyncQueue';
import { BdapActions } from '../../shared/actions/bdap';
import { getType, ActionType } from 'typesafe-actions';
import { RpcClient } from '../RpcClient';
import { getMyBdapAccount } from './effects/getMyBdapAccount';
import { BdapAccount } from '../../dynamicdInterfaces/BdapAccount';
import { getUserNameFromFqdn } from './getUserNameFromFqdn';
import { Link } from '../../dynamicdInterfaces/links/Link';
import { blinq } from 'blinq';



const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");

export function* newLinkDirectoryCreateSaga(rpcClient: RpcClient) {
    const q = createAsyncQueue<Link>()
    yield takeEvery(getType(BdapActions.completeLinkCreated), ({ payload: link }: ActionType<typeof BdapActions.completeLinkCreated>) => {
        q.post(link)
    })
    const bdapAccount: BdapAccount | undefined = yield getMyBdapAccount(rpcClient)
    if (!bdapAccount) {
        throw Error("no bdap account")
    }
    for (; ;) {
        const link: Link = yield call(() => q.receive())
        const otherEndUser = getOtherUser(link, bdapAccount)
        const userShareFolder = path.join(pathToShareDirectory, otherEndUser)
        const paths = [
            path.join(userShareFolder, "in"),
            path.join(userShareFolder, "out")
        ]
        for (const p of paths) {
            yield call(() => fsExtra.ensureDir(p))
        }

    }

}
const getOtherUser = (link: Link, bdapAccount: BdapAccount): string => {
    const linkParticipants = blinq([link.recipient_fqdn, link.requestor_fqdn]);
    const bothAreNotNull = linkParticipants.all(fqdn => fqdn != null)
    const oneIsMe = bdapAccount && linkParticipants.any(fqdn => fqdn === bdapAccount.object_full_path)
    const oneIsntMe = bdapAccount && linkParticipants.any(fqdn => fqdn !== bdapAccount.object_full_path)
    const isValidLink = bothAreNotNull && oneIsMe && oneIsntMe
    if (!isValidLink) {
        console.warn(`link is not valid ${link}`)
        throw Error("link is not valid")
    }
    const otherEndFqdn = bdapAccount && linkParticipants.singleOrDefault(fqdn => fqdn !== bdapAccount.object_full_path)
    if (!otherEndFqdn) {
        console.warn(`link is not valid ${link}`)
        throw Error("link is not valid")
    }
    const otherEndUser = getUserNameFromFqdn(otherEndFqdn)
    if (!otherEndUser) {
        throw Error("could not extract other user from link")
    }
    return otherEndUser
}