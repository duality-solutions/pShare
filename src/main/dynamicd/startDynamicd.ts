import * as path from 'path'
import childProcess from 'child_process'
import os from 'os'
import { app } from 'electron'
import { initializeDynamicConfig } from '../configuration/initializeDynamicConfig';
import { CancellationToken } from '../../shared/system/createCancellationToken';
import { notifyOnFileNotExists } from '../../shared/system/notifyOnFileNotExists';
import { DynamicdProcessInfo } from './DynamicdProcessInfo';
import { DynamicdProcessStartOptions } from './DynamicdProcessStartOptions';
import { createEventEmitter } from '../../shared/system/events/createEventEmitter';
import { createPromiseResolver } from '../../shared/system/createPromiseResolver';
import * as fs from 'fs'
import { fileExists } from '../../shared/system/fileExists';
declare global {
    //comes from electron. the location of the /static directory
    const __static: string
}
export async function startDynamicd(cancellationToken: CancellationToken): Promise<DynamicdProcessInfo> {
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment) {
        console.log("not starting dynamicd as in development, this should be running in docker")
        return {
            start: () => { },
            //dispose: async () => console.log("dispose does nothing in development"),
            addEventListener: () => true,
            removeEventListener: () => true,
            rpcUser: "CWIXE4bsgA",
            rpcPassword: "KT7xrPgVWWvakblJApSh8"
        }
    }
    const topLevelDynamicdDirectory = path.join(__static, "dynamicd")
    const platformSpecificStaticPath = path.join(topLevelDynamicdDirectory, os.platform());
    const pathToDynamicd = path.join(platformSpecificStaticPath, "dynamicd")
    //const pathToDynamicCli = path.join(platformSpecificStaticPath, "dynamic-cli")
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
        sharedParameters
    };
    const processInfo = await startDynamicdProcess(opts, cancellationToken);
    return processInfo
}
async function startDynamicdProcess(
    {
        pathToDynamicConf,
        pathToDataDir,
        pathToDynamicdDefaultConf,
        pathToPidFile,
        pathToDynamicd,
        sharedParameters
    }: DynamicdProcessStartOptions, cancellationToken: CancellationToken) {

    const { rpcUser, rpcPassword } = await initializeDynamicConfig({ pathToDynamicConf, pathToDataDir, pathToDynamicdDefaultConf }, cancellationToken);
    //const token = createCancellationToken(undefined, cancellationToken);
    let started = false;
    const { addEventListener, dispatchEvent, removeEventListener } = createEventEmitter();
    if (await fileExists(pathToPidFile)) {
        throw Error("Cannot start dynamicd. Pid file already exists.")
    }
    const processInfo = {
        start: () => {
            if (!started) {
                notifyOnFileNotExists(pathToPidFile, async () => {
                    console.log(`${pathToPidFile} does not exist`)
                    const wasStarted = started;
                    started = true;
                    const resolver = createPromiseResolver();
                    childProcess.execFile(pathToDynamicd, sharedParameters, { encoding: "utf8" }, (err, stdout, ) => {
                        if (err) {
                            resolver.reject(err)
                        } else {
                            resolver.resolve(stdout)
                        }
                    });
                    try {
                        await resolver.promise;
                    } catch (err) {
                        console.warn(`${pathToDynamicd} did not restart`)
                        console.error(err)
                        throw err;
                    }
                    console.warn("dynamicd (re)started")
                    dispatchEvent(wasStarted ? "restart" : "start", null);
                }, cancellationToken);
            }
        },
        addEventListener,
        removeEventListener,
        rpcUser,
        rpcPassword
    };
    addLoggingEventListeners(processInfo);
    processInfo.start();
    cancellationToken.register(async () => {
        console.warn("issuing stop to dynamicd")
        try {
            process.kill(parseInt(fs.readFileSync(pathToPidFile).toString()), 15)
        } catch{
            console.warn("SIGTERM failed")
        }
        dispatchEvent("stopping", {});
    })
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

