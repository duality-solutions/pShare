import { promisify } from 'util'
import { exists as e } from 'fs'
import fsExtra from 'fs-extra'
import { randomBytes as r } from 'crypto'
import { DynamicConfigOptions } from './DynamicConfigOptions';
import { getKeyValuePairsFromConfFile } from './getKeyValuePairsFromConf';
import { blinq } from 'blinq'

const exists = promisify(e)
const randomBytes = promisify(r)

export async function initializeDynamicConfig({ pathToDynamicdDefaultConf, pathToDynamicConf, pathToDataDir }: DynamicConfigOptions) {
    var hasConfig = await exists(pathToDynamicConf);
    if (!hasConfig) {
        await fsExtra.mkdirp(pathToDataDir);

        const rpcUser = await getRandomToken(16);
        const rpcPassword = await getRandomToken(64);
        const defaultConfDataIterator = await getKeyValuePairsFromConfFile(pathToDynamicdDefaultConf);
        const defaultConfData = [...defaultConfDataIterator];
        const rewrittenConfFileLines = defaultConfData
            .map(({ key, value }) => ({
                key,
                value: key === "rpcuser" ?
                    rpcUser :
                    key === "rpcpassword" ?
                        rpcPassword :
                        value
            }))
            .map(({ key, value }) => `${key}=${value}`);
        //by convention, we should leave empty line at end of file
        const rewrittenConf = [...rewrittenConfFileLines, ""].join("\n");
        await fsExtra.writeFile(pathToDynamicConf, rewrittenConf, { encoding: "utf8" });
    }
    const confDataIterator = await getKeyValuePairsFromConfFile(pathToDynamicConf)
    const confData = [...confDataIterator]
    const blConfData = blinq(confData)
    const rpcUser = blConfData.single(x => x.key === "rpcuser").value;
    const rpcPassword = blConfData.single(x => x.key === "rpcpassword").value;
    return { rpcUser, rpcPassword };

}

async function getRandomToken(tokenLength: number) {
    const buf = await randomBytes(tokenLength);
    return buf.toString("hex")
}