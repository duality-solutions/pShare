import * as path from 'path'
import childProcess from 'child_process'
import os from 'os'
import { app } from 'electron'
import { initializeDynamicConfig } from '../configuration/initializeDynamicConfig';
import { CancellationToken } from '../../shared/system/createCancellationToken';
import { DynamicdProcessInfo } from './DynamicdProcessInfo';
import { DynamicdProcessStartOptions } from './DynamicdProcessStartOptions';
import { createEventEmitter } from '../../shared/system/events/createEventEmitter';
import { createPromiseResolver } from '../../shared/system/createPromiseResolver';
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
    const osPlaform = os.platform();
    const platformSpecificStaticPath = path.join(topLevelDynamicdDirectory, osPlaform);
    const pathToDynamicd = path.join(platformSpecificStaticPath, `dynamicd${osPlaform === "win32" ? ".exe" : ""}`)
    const pathToDynamicCli = path.join(platformSpecificStaticPath, `dynamic-cli${osPlaform === "win32" ? ".exe" : ""}`)
    const pathToDynamicdDefaultConf = path.join(topLevelDynamicdDirectory, "dynamic.default.conf")
    const pathToDataDir = path.join(app.getPath("home"), ".pshare", ".dynamic")
    const pathToDynamicConf = path.join(pathToDataDir, "dynamic.conf")
    const sharedParameters = [`-conf=${pathToDynamicConf}`, `-datadir=${pathToDataDir}`]
    const opts = {
        pathToDynamicConf,
        pathToDataDir,
        pathToDynamicdDefaultConf,
        pathToDynamicd,
        sharedParameters,
        pathToDynamicCli,

    };
    const processInfo = await startDynamicdProcess(opts, cancellationToken);
    return processInfo
}
async function startDynamicdProcess(
    {
        pathToDynamicConf,
        pathToDataDir,
        pathToDynamicdDefaultConf,
        pathToDynamicd,
        sharedParameters,
    }: DynamicdProcessStartOptions, cancellationToken: CancellationToken) {

    const { rpcUser, rpcPassword } = await initializeDynamicConfig({ pathToDynamicConf, pathToDataDir, pathToDynamicdDefaultConf }, cancellationToken);
    //const token = createCancellationToken(undefined, cancellationToken);
    let started = false;
    const { addEventListener, dispatchEvent, removeEventListener } = createEventEmitter();
    const processInfo = {
        start: async () => {
            if (!started) {
                while (!cancellationToken.isCancellationRequested) {
                    const wasStarted = started;
                    started = true;
                    const resolver = createPromiseResolver();
                    console.log(wasStarted ? "restarting dynamicd" : "starting dynamicd")
                    const process = childProcess.execFile(pathToDynamicd, sharedParameters, { encoding: "utf8" }, (err, stdout, ) => {
                        if (err) {
                            resolver.reject(err)
                        } else {
                            resolver.resolve(stdout)
                        }
                    });
                    const registration = cancellationToken.register(async () => {
                        process.kill("SIGTERM");
                        dispatchEvent("stopping", {});
                        await resolver.promise
                        console.warn("dynamicd terminated from cancellationToken registration")
                    })
                    dispatchEvent(wasStarted ? "restart" : "start", null);
                    try {
                        await resolver.promise;
                    } catch (err) {
                        console.warn(`${pathToDynamicd} returned an error`)
                        console.error(err)
                        throw err;
                    } finally {
                        registration.unregister()
                    }
                    //break;
                    console.warn("dynamicd terminated")

                }
                console.log("dynamicd restart loop cancelled")
            }
        },
        addEventListener,
        removeEventListener,
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

