export interface Encryptor {
    encrypt: (payload: string) => string;
    decrypt: (encryptedPayload: string) => string;
    encryptObject: <T>(payload: T) => string;
    decryptObject: <T>(encryptedPayload: string) => T;
}
