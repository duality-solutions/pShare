import { takeEvery, call, put, take } from "redux-saga/effects";
import { getType, ActionType, isActionOf } from "typesafe-actions";
import { FileSharingActions, LinkMessageEnvelope, FileRequest, FileInfo, LinkRouteEnvelope } from "../../shared/actions/fileSharing";
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { v4 as uuid } from 'uuid';
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { Action } from "redux";
import * as path from 'path'
import * as fs from 'fs'
import { copyFileToRTCPeer } from "./helpers/copyFileToRTCPeer";
import { RtcActions } from "../../shared/actions/rtc";
import { receiveFileFromRTCPeer } from "./helpers/receiveFileFromRTCPeer";
import { prepareErrorForSerialization } from "../../shared/proxy/prepareErrorForSerialization";
import { remote } from "electron";
import fsExtra from 'fs-extra'
import { entries } from "../../shared/system/entries";

const app = remote.app
//this runs in rtc
export function* requestFileSaga() {
    console.log("requestFileSaga started")
    yield takeEvery(getType(FileSharingActions.requestFile), function* (action: ActionType<typeof FileSharingActions.requestFile>) {
        const peer: PromiseType<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        const offer: RTCSessionDescription = yield call(() => peer.createOffer())
        const offerEnvelope: LinkMessageEnvelope<FileRequest> = {
            sessionDescription: offer.toJSON(),
            payload: action.payload,
            id: uuid(),
            timestamp: Math.trunc((new Date()).getTime()),
            type: "pshare-offer"
        }
        console.log("sending offerEnvelope : ", JSON.stringify(offerEnvelope))
        const routeEnvelope: LinkRouteEnvelope<LinkMessageEnvelope<FileRequest>> = {
            recipient: action.payload.ownerUserName,
            payload: offerEnvelope
        }
        yield put(FileSharingActions.sendLinkMessage(routeEnvelope))
        const answerAction: ActionType<typeof FileSharingActions.answerEnvelopeReceived> = yield take(
            (action: Action<any>) =>
                isActionOf(FileSharingActions.answerEnvelopeReceived, action)
                && action.payload.id === offerEnvelope.id,
        )
        const { payload: { sessionDescription: answerSdp, payload: fileInfo } } = answerAction

        const answerSessionDescription = new RTCSessionDescription(answerSdp);
        yield call(() => peer.setRemoteDescription(answerSessionDescription))
        yield call(() => peer.waitForDataChannelOpen())


        const otherEndUser = action.payload.ownerUserName
        const { incoming, temp }: UserSharePaths = yield getOrCreateShareDirectoryForUser(otherEndUser);
        const tempPath = path.join(temp, `__${uuid()}`)
        //debugger
        try {
            yield receiveFileFromRTCPeer(tempPath, peer, fileInfo)
        } catch (err) {
            yield put(RtcActions.fileReceiveFailed(prepareErrorForSerialization(err)))
            return
        }

        const safeName = path.basename(path.normalize(fileInfo.path))
        let targetPath: string
        const [firstSeg, ...remainingSegs] = safeName.split(".")
        for (let i = 0; ; ++i) {
            targetPath = path.join(incoming, i === 0 ? safeName : `${firstSeg}(${i})${["", ...remainingSegs].join(".")}`)
            try {
                yield call(() => fs.promises.stat(targetPath))
            } catch (err) {
                if (/^ENOENT: no such file or directory/.test(err.message)) {
                    break
                }
            }

        }
        yield call(() => fs.promises.rename(tempPath, targetPath))
        console.log("file received")
        yield put(RtcActions.fileReceiveSuccess())

    })
}
interface UserSharePaths {
    incoming: string
    outgoing: string
    temp: string
}
function getOrCreateShareDirectoryForUser(otherEndUser: string) {
    return call(function* () {
        const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");
        const userShareFolder = path.join(pathToShareDirectory, otherEndUser);
        const paths: UserSharePaths = {
            incoming: path.join(userShareFolder, "in"),
            outgoing: path.join(userShareFolder, "out"),
            temp: path.join(pathToShareDirectory, "temp")
        };
        for (const [, dir] of entries(paths)) {
            yield call(() => fsExtra.ensureDir(dir));
        }
        return paths
    })
}

export function* processIncomingOfferSaga() {
    yield takeEvery(
        getType(FileSharingActions.offerEnvelopeReceived),
        function* (action: ActionType<typeof FileSharingActions.offerEnvelopeReceived>) {
            const { payload: offerEnvelope } = action
            const answerPeer: PromiseType<ReturnType<typeof getAnswerPeer>> = yield call(() => getAnswerPeer())
            const { sessionDescription: offerSdp, id: transactionId, payload: fileRequest } = offerEnvelope
            console.log(fileRequest)
            const offerSessionDescription = new RTCSessionDescription(offerSdp)
            const answer: RTCSessionDescription = yield call(() => answerPeer.getAnswer(offerSessionDescription))

            const internalFileInfo: InternalFileInfo = yield getFileInfo(fileRequest.fileId)

            const { localPath, ...fileInfo } = internalFileInfo

            const answerEnvelope: LinkMessageEnvelope<FileInfo> =
            {
                sessionDescription: answer.toJSON(),
                id: transactionId,
                timestamp: Math.trunc((new Date()).getTime()),
                type: "pshare-answer",
                payload: fileInfo
            }
            const routeEnvelope: LinkRouteEnvelope<LinkMessageEnvelope<FileInfo>> = {
                recipient: fileRequest.requestorUserName,
                payload: answerEnvelope
            }


            yield put(FileSharingActions.sendLinkMessage(routeEnvelope))
            yield call(() => answerPeer.waitForDataChannelOpen())



            try {
                yield copyFileToRTCPeer(localPath, answerPeer)
            } catch (err) {
                yield put(RtcActions.fileSendFailed(prepareErrorForSerialization(err)))
                return
            } finally {
                answerPeer.dataChannel.close()
            }
            yield put(RtcActions.fileSendSuccess())

        })
}

interface InternalFileInfo {
    localPath: string
    type: string
    size: number
    path: string
}

function getFileInfo(fileId: string) {
    return call(function* () {
        const localPath = path.join(__static, "example.mp4");
        const stats: fs.Stats = yield call(() => fs.promises.stat(localPath))
        const output: InternalFileInfo = {
            localPath: localPath,
            type: "video/mp4",
            size: stats.size,
            path: "example.mp4"
        }
        return output
    })
}