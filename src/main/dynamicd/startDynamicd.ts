import * as path from 'path'
import childProcess from 'child_process'
import os from 'os'
import { app } from 'electron'
import { initializeDynamicConfig } from '../configuration/initializeDynamicConfig';
import { createCancellationToken } from '../../shared/system/createCancellationToken';
import { waitForChildProcessExit } from '../../shared/system/waitForChildProcessExit';
import { notifyOnFileNotExists } from '../../shared/system/notifyOnFileNotExists';
import { DynamicdProcessInfo } from './DynamicdProcessInfo';
import { DynamicdProcessStartOptions } from './DynamicdProcessStartOptions';
import { createEventEmitter } from '../../shared/system/events/createEventEmitter';
declare global {
    //comes from electron. the location of the /static directory
    const __static: string
}
export async function startDynamicd(): Promise<DynamicdProcessInfo> {
    const isDevelopment = false//process.env.NODE_ENV === 'development'
    if (isDevelopment) {
        console.log("not starting dynamicd as in development, this should be running in docker")
        return {
            start: () => { },
            dispose: async () => console.log("dispose does nothing in development"),
            addEventListener: () => true,
            removeEventListener: () => true,
            rpcUser: "CWIXE4bsgA",
            rpcPassword: "KT7xrPgVWWvakblJApSh8"
        }
    }
    const topLevelDynamicdDirectory = path.join(__static, "dynamicd")
    const platformSpecificStaticPath = path.join(topLevelDynamicdDirectory, os.platform());
    const pathToDynamicd = path.join(platformSpecificStaticPath, "dynamicd")
    const pathToDynamicCli = path.join(platformSpecificStaticPath, "dynamic-cli")
    const pathToDynamicdDefaultConf = path.join(topLevelDynamicdDirectory, "dynamic.default.conf")
    const pathToDataDir = path.join(app.getPath("home"), ".pshare", ".dynamic")
    const pathToDynamicConf = path.join(pathToDataDir, "dynamic.conf")
    const pathToPidFile = path.join(pathToDataDir, "dynamicd.pid")
    const sharedParameters = [`-conf=${pathToDynamicConf}`, `-datadir=${pathToDataDir}`, `-pid=${pathToPidFile}`]
    const opts = {
        pathToDynamicConf,
        pathToDataDir,
        pathToDynamicdDefaultConf,
        pathToPidFile,
        pathToDynamicd,
        sharedParameters,
        pathToDynamicCli
    };
    const processInfo = await startDynamicdProcess(opts);
    return processInfo
}
async function startDynamicdProcess(
    {
        pathToDynamicConf,
        pathToDataDir,
        pathToDynamicdDefaultConf,
        pathToPidFile,
        pathToDynamicd,
        sharedParameters,
        pathToDynamicCli
    }: DynamicdProcessStartOptions) {

    const { rpcUser, rpcPassword } = await initializeDynamicConfig({ pathToDynamicConf, pathToDataDir, pathToDynamicdDefaultConf });
    const token = createCancellationToken();
    let started = false;
    const { addEventListener, dispatchEvent, removeEventListener } = createEventEmitter();
    const processInfo = {
        start: () => {
            if (!started) {
                notifyOnFileNotExists(pathToPidFile, async () => {
                    const wasStarted = started;
                    started = true;
                    const proc = childProcess.execFile(pathToDynamicd, sharedParameters);
                    await waitForChildProcessExit(proc);
                    dispatchEvent(wasStarted ? "restart" : "start", null);
                }, token);
            }
        },
        addEventListener,
        removeEventListener,
        dispose: async () => {
            token.cancel();
            const proc = childProcess.execFile(pathToDynamicCli, [...sharedParameters, "stop"]);
            await waitForChildProcessExit(proc);
            dispatchEvent("stopping", {});
        },
        rpcUser,
        rpcPassword
    };
    addLoggingEventListeners(processInfo);
    processInfo.start();
    return processInfo;
}

function addLoggingEventListeners(processInfo: DynamicdProcessInfo) {
    const loggedEvents = ["start", "restart", "stopping"];
    const evtHandlers = loggedEvents.map(evtName => () => {
        if (evtName === "stopping") {
            loggedEvents
                .map((en, idx) => ({
                    evtName: en,
                    handler: evtHandlers[idx]
                }))
                .forEach(
                    ({ evtName, handler }) =>
                        processInfo.removeEventListener(evtName, handler)
                );
        }
        console.log(`Dynamicd process info event : ${evtName}`);
    });
    loggedEvents
        .map(
            (en, idx) => ({
                evtName: en,
                handler: evtHandlers[idx]
            }))
        .forEach(({ evtName, handler }) =>
            processInfo.addEventListener(evtName, handler));
}

