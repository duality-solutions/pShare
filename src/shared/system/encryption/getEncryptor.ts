import { encrypt as enc, decrypt as dec } from "sjcl-local"
import { Encryptor } from "./Encryptor";

//aes with keysize 256, tag size 128 and 100000 iterations for password hashing
const encryptionOpts = { iter: 100000, ks: 256, ts: 128 };
const encrypt = (password: string) => (payload: string): string => enc(password, payload, encryptionOpts)
const decrypt = (password: string) => (encryptedPayload: string): string => dec(password, encryptedPayload)


export const getEncryptor = (password: string): Encryptor => {
    const e = encrypt(password)
    const d = decrypt(password)
    return ({
        encrypt: e,
        decrypt: d,
        encryptObject: <T>(payload: T): string => e(JSON.stringify(payload)),
        decryptObject: <T>(encryptedPayload: string): T => JSON.parse(d(encryptedPayload))
    });
}

export const isCorruptError = (err: any) => /^CORRUPT\:/.test(err.toString())