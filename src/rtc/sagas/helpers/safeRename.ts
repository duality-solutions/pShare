import { call } from "redux-saga/effects";
import * as path from 'path'
import * as fs from 'fs'

export function safeRename(src: string, targetDirectory: string, targetName: string) {
    return call(function* () {
        let targetPath: string;
        const [firstSeg, ...remainingSegs] = targetName.split(".");
        for (let i = 0; ; ++i) {
            targetPath = path.join(targetDirectory, i === 0 ? targetName : `${firstSeg}(${i})${["", ...remainingSegs].join(".")}`);
            try {
                yield call(() => fs.promises.stat(targetPath));
            }
            catch (err) {
                if (/^ENOENT: no such file or directory/.test(err.message)) {
                    break;
                }
            }
        }
        yield call(() => fs.promises.rename(src, targetPath));
    });
}
