export function toBuffer(ab: ArrayBuffer, offset: number, amt: number) {
    const off = offset == null ? 0 : Math.min(offset, ab.byteLength)
    const len = Math.min(typeof amt !== 'undefined' ? amt : ab.byteLength - off, ab.byteLength);
    return Buffer.from(ab, off, len)
}
export function toArrayBuffer(buf: Buffer, offset: number, amt: number) {
    const off = offset == null ? 0 : Math.min(offset, buf.length)
    const len = Math.min(amt != null ? amt : buf.length - off, buf.length);
    const ab = buf.buffer.slice(off, len);
    return ab;
}