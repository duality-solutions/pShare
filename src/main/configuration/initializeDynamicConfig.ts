import { promisify } from 'util'
import { exists as e } from 'fs'
import fsExtra from 'fs-extra'
import { randomBytes as r } from 'crypto'
import { DynamicConfigOptions } from './DynamicConfigOptions';
import { getKeyValuePairsFromConfFile } from './getKeyValuePairsFromConf';
import { blinq } from 'blinq'
import { CancellationToken, asCancellable } from '../../shared/system/createCancellationTokenSource';

const exists = promisify(e)
const randomBytes = promisify(r)

export async function initializeDynamicConfig({ pathToDynamicdDefaultConf, pathToDynamicConf, pathToDataDir }: DynamicConfigOptions, cancellationToken: CancellationToken) {
    var hasConfig = await asCancellable(exists(pathToDynamicConf), cancellationToken);
    if (!hasConfig) {
        await asCancellable(fsExtra.mkdirp(pathToDataDir), cancellationToken);

        const rpcUser = await asCancellable(getRandomToken(16), cancellationToken);
        const rpcPassword = await asCancellable(getRandomToken(64), cancellationToken);
        const defaultConfDataIterator = await asCancellable(getKeyValuePairsFromConfFile(pathToDynamicdDefaultConf), cancellationToken);
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
        await asCancellable(fsExtra.writeFile(pathToDynamicConf, rewrittenConf, { encoding: "utf8" }), cancellationToken);
    }
    const confDataIterator = await asCancellable(getKeyValuePairsFromConfFile(pathToDynamicConf), cancellationToken)
    let confData = [...confDataIterator]
    //we need to ditch the daemon config
    if (confData.some(({ key }) => key === "daemon")) {
        confData = confData.filter(({ key }) => key !== "daemon")
        const rewrittenConf = [...confData, ""].join("\n");
        await asCancellable(fsExtra.writeFile(pathToDynamicConf, rewrittenConf, { encoding: "utf8" }), cancellationToken);
    }
    const blConfData = blinq(confData)
    const rpcUser = blConfData.single(x => x.key === "rpcuser").value;
    const rpcPassword = blConfData.single(x => x.key === "rpcpassword").value;
    return { rpcUser, rpcPassword };

}



async function getRandomToken(tokenLength: number) {
    const buf = await randomBytes(tokenLength);
    return buf.toString("hex")
}

