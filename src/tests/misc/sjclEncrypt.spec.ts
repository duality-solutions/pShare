import { encrypt, decrypt } from "sjcl-local"

test("can encrypt", () => {
    const password = "monkey";
    const payload = "this is a test";
    const encrypted = encrypt(password, payload,{iter:100000,ks:256,ts:128})
    expect(typeof encrypted).toBe("string")
    console.log(`encrypted data : ${encrypted}`)
    const decrypted = decrypt(password, encrypted)
    expect(payload).not.toBe(encrypted)
    expect(payload).toBe(decrypted)

    expect(()=>decrypt("foo",encrypted)).toThrow()

})