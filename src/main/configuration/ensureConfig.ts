import util from 'util'
import fs from 'fs'
import fsExtra from 'fs-extra'
import crypto from 'crypto'
import DynamicConfigOptions from './DynamicConfigOptions';

const exists = util.promisify(fs.exists)
const randomBytes = util.promisify(crypto.randomBytes)

export default async function ensureConfig({ pathToDynamicdDefaultConf, pathToDynamicConf, pathToDataDir }: DynamicConfigOptions) {
    var hasConfig = await exists(pathToDynamicConf);
    if (!hasConfig) {
        await fsExtra.mkdirp(pathToDataDir);
        const conf = await fsExtra.readFile(pathToDynamicdDefaultConf, "utf8");
        const rpcUser = await getRandomToken(16);
        const rpcPass = await getRandomToken(64);
        const confData = [...getKeyValuePairsFromConf(conf)];
        const rewrittenConfFileLines = confData
            .map(({ key, value }) => ({
                key,
                value: key === "rpcuser" ?
                    rpcUser :
                    key === "rpcpassword" ?
                        rpcPass :
                        value
            }))
            .map(({ key, value }) => `${key}=${value}`);
        //by convention, we should leave empty line at end of file
        const rewrittenConf = [...rewrittenConfFileLines, ""].join("\n");
        await fsExtra.writeFile(pathToDynamicConf, rewrittenConf, { encoding: "utf8" });
    }
}

function* getKeyValuePairsFromConf(conf: string) {
    const regex = /^(?!\#)([^\=]*)\=(.*)$/gm
    let result: RegExpExecArray | null
    while ((result = regex.exec(conf)) !== null) {
        const [, key, value] = result;
        yield { key, value }
    }
}
async function getRandomToken(tokenLength: number) {
    const buf = await randomBytes(tokenLength);
    return buf.toString("hex")
}