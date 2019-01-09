import * as path from 'path'
import childProcess from 'child_process'
import os from 'os'
import { app } from 'electron'
import ensureConfig from './configuration/ensureConfig';


declare global {
    //comes from electron. the location of the /static directory
    const __static: string
}
export default async function () {

    const topLevelDynamicdDirectory = path.join(__static, "dynamicd")
    const platformSpecificStaticPath = path.join(topLevelDynamicdDirectory, os.platform());
    const pathToDynamicd = path.join(platformSpecificStaticPath, "dynamicd")
    const pathToDynamicCli = path.join(platformSpecificStaticPath, "dynamic-cli")
    const pathToDynamicdDefaultConf = path.join(topLevelDynamicdDirectory, "dynamic.default.conf")
    const pathToDataDir = path.join(app.getPath("home"), ".pshare", ".dynamic")
    const pathToDynamicConf = path.join(pathToDataDir, "dynamic.conf")
    const sharedParameters = [`-conf=${pathToDynamicConf}`, `-datadir=${pathToDataDir}`]

    await ensureConfig({ pathToDynamicConf, pathToDataDir, pathToDynamicdDefaultConf });
    childProcess.execFile(pathToDynamicd, sharedParameters)
    //we could issue an RPC stop here, but spinning off to a process is more robust
    return { dispose: () => childProcess.execFile(pathToDynamicCli, [...sharedParameters, "stop"]) }


}


