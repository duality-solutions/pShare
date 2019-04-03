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
import { delay } from '../../shared/system/delay';
import { PromiseResolver } from '../../shared/system/PromiseResolver';
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
        pathToDynamicCli
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
                    const resolver = createPromiseResolver<string>();
                    console.log(wasStarted ? "restarting dynamicd" : "starting dynamicd")
                    const dynamicdProcess = childProcess.execFile(pathToDynamicd, sharedParameters, { encoding: "utf8" }, (err, stdout, ) => {
                        if (err) {
                            resolver.reject(err)
                        } else {
                            resolver.resolve(stdout)
                        }
                    });
                    const registration = cancellationToken.register(async () => {
                        const timeoutPromise = delay(15000)
                        let r: PromiseResolver<string>;

                        for (; ;) {
                            r = createPromiseResolver();
                            childProcess.execFile(pathToDynamicCli, [...sharedParameters, "stop"], { encoding: "utf8" }, (err, stdout, ) => {
                                if (err) {
                                    r.reject(err)
                                } else {
                                    r.resolve(stdout)
                                }
                            });
                            let completedProm: Promise<any>
                            try {
                                const [completed] = await Promise.race([r.promise, timeoutPromise].map(p => p.then(() => [p])));
                                completedProm = completed
                            } catch (error) {
                                continue
                            }
                            if (completedProm === r.promise) {
                                // we successfully issued a shutdown
                                dispatchEvent("stopping", {});
                                await resolver.promise
                                console.warn("dynamicd terminated from cancellationToken registration")

                            } else {
                                console.warn("dynamicd failed to terminate from cancellationToken registration, attempting SIGKILL")

                                try {
                                    dynamicdProcess.kill("SIGKILL")
                                } catch (error) {
                                    console.warn("SIGKILL failed: ", error.message)
                                }
                            }
                            break
                        }
                    })
                    dispatchEvent(wasStarted ? "restart" : "start", null);
                    try {
                        await resolver.promise;
                    } catch (err) {

                        console.warn(`${pathToDynamicd} returned an error`)
                        console.log(`cancellation ${cancellationToken.isCancellationRequested ? "has" : "has not"} been requested`)
                        console.error(err)
                        if (!cancellationToken.isCancellationRequested) {
                            throw err;
                        }
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

