import * as crypto from 'crypto'
import * as fs from 'fs'

export function hashFile(path: string, algorithm: HashAlgorithm = 'md5'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const shasum = crypto.createHash(algorithm);
        const s = fs.createReadStream(path);
        const errorHandler: (...args: any[]) => void = function (err) {
            unsubscribe();
            reject(err);
        };
        const dataHandler: (...args: any[]) => void = function (data) {
            shasum.update(data);
        };
        const endHandler: (...args: any[]) => void = function () {
            unsubscribe();
            var hash = shasum.digest('base64');
            resolve(hash);
        };
        s.on('error', errorHandler);
        s.on('data', dataHandler);
        s.on('end', endHandler);
        const unsubscribe = () => {
            s.off('error', errorHandler);
            s.off('data', dataHandler);
            s.off('end', endHandler);
        };
    });
}
type HashAlgorithm = 'sha1' | 'md5' | 'sha256' | 'sha512';
