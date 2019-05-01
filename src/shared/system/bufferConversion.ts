export function toBuffer(ab: ArrayBuffer) {
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}
export function toArrayBuffer(buf: Buffer, amt?: number) {
    const len = Math.min(typeof amt !== 'undefined' ? amt : buf.length, buf.length);
    const ab = new ArrayBuffer(len);
    const view = new Uint8Array(ab);
    for (let i = 0; i < len; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
