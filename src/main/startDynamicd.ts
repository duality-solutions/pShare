import * as path from 'path'
import childProcess from 'child_process'
import os from 'os'
import { app } from 'electron'
import { initializeDynamicConfig } from './configuration/initializeDynamicConfig';
import { createCancellationToken } from '../shared/system/createCancellationToken';
import { waitForChildProcessExit } from '../shared/system/waitForChildProcessExit';
import { notifyOnFileNotExists } from '../shared/system/notifyOnFileNotExists';
declare global {
    //comes from electron. the location of the /static directory
    const __static: string
}
interface DynamicdProcessInfo {
    dispose(): void
    rpcUser: string
    rpcPassword: string
}
export async function startDynamicd(): Promise<DynamicdProcessInfo> {
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment) {
        console.log("not starting dynamicd as in development, this should be running in docker")
        return { dispose: () => console.log("dispose does nothing in development"), rpcUser: "CWIXE4bsgA", rpcPassword: "KT7xrPgVWWvakblJApSh8" }
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
    const { rpcUser, rpcPassword } = await initializeDynamicConfig({ pathToDynamicConf, pathToDataDir, pathToDynamicdDefaultConf });
    const token = createCancellationToken()
    notifyOnFileNotExists(pathToPidFile, async () => {
        console.warn(`pidfile was deleted, restarting dynamicd`)
        const proc = childProcess.execFile(pathToDynamicd, sharedParameters)
        await waitForChildProcessExit(proc);
    }, token)
    return {
        dispose: () => {
            token.cancel()
            return childProcess.execFile(pathToDynamicCli, [...sharedParameters, "stop"]);
        },
        rpcUser,
        rpcPassword
    }
}

