import fsExtra from 'fs-extra'
export function* getKeyValuePairsFromConfString(conf: string) {
    const regex = /^(?!\#)([^\=]*)\=(.*)$/gm;
    let result: RegExpExecArray | null;
    while ((result = regex.exec(conf)) !== null) {
        const [, key, value] = result;
        yield { key, value };
    }
}
export async function getKeyValuePairsFromConfFile(confFilePath: string) {
    const conf = await fsExtra.readFile(confFilePath, "utf8");
    return getKeyValuePairsFromConfString(conf)
}
