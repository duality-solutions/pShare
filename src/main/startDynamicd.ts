import * as path from 'path'
import childProcess from 'child_process'
import os from 'os'
import { app } from 'electron'
import util from 'util'
import fs from 'fs'
import fsExtra from 'fs-extra'

const exists = util.promisify(fs.exists)
const copyFile = util.promisify(fs.copyFile)
const spawn = util.promisify(childProcess.spawn)

declare global {
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

    var hasConfig = await exists(pathToDynamicConf);
    console.log("has config", hasConfig)
    if (!hasConfig) {
        await fsExtra.mkdirp(pathToDataDir)
        await copyFile(pathToDynamicdDefaultConf, pathToDynamicConf);
    }

    //const params = [...sharedParameters]
    //console.log(pathToDynamicd, params)

    const dynamicdProcess = childProcess.execFile(pathToDynamicd, sharedParameters)



    console.log("started dynamicd",dynamicdProcess.pid)

    //really we should issue an RPC stop here, but this will do FTTB
    return { dispose: () => childProcess.execFile(pathToDynamicCli, [...sharedParameters, "stop"]) }

    
}
