import { encrypt, decrypt } from "sjcl"

test("can encrypt", () => {
    const password = "monkey";
    const payload = "this is a test";
    const encrypted = encrypt(password, payload)
    const decrypted = decrypt(password, encrypted)
    expect(payload).toBe(decrypted)

})