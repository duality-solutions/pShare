import * as path from 'path'
import * as fs from 'fs'
export function fileExists(filepath: string, options?: RootOpts) {
    return new Promise((resolve, reject) => {
        fs.stat(fullPath(filepath, options), (err, stats) => {
            if (err) {
                return err.code === 'ENOENT'
                    ? resolve(false)
                    : reject(err);
            }
            resolve(stats.isFile());
        });
    });
}
interface RootOpts {
    root?: string;
}
function fullPath(filepath: string, options?: RootOpts) {
    const root = (options || {}).root;
    return (root) ? path.join(root, filepath) : filepath;
}
