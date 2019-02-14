import { getEncryptor } from "../../shared/system/encryption/getEncryptor";

test("getEncryptor wrapper", () => {
    const password = "monkey";
    const payloadStr = "this is a test";
    interface A {
        a: number
        b: string
    }

    const payloadObj: A = { a: 1, b: "hello world" }

    const { decrypt, decryptObject, encrypt, encryptObject } = getEncryptor(password)

    const encryptedStr = encrypt(payloadStr)
    const decryptedStr = decrypt(encryptedStr)

    expect(payloadStr).not.toBe(encryptedStr)
    expect(payloadStr).toBe(decryptedStr)

    const encryptedObj = encryptObject(payloadObj)
    const decryptedObj = decryptObject<A>(encryptedObj)
    expect(payloadObj).toEqual(decryptedObj)


})