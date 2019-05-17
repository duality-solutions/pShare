export function toBuffer(ab: ArrayBuffer, offset: number, amt: number) {
    if (offset > ab.byteLength || offset < 0 || amt > ab.byteLength - offset || amt < 0) {
        throw Error("out of range parameters")
    }
    return Buffer.from(ab, offset, amt)
}
export function toArrayBuffer(buf: Buffer, offset: number, amt: number) {

    if (offset > buf.length || offset < 0 || amt > buf.length - offset || amt < 0) {
        throw Error("out of range parameters")
    }
    const ab = buf.buffer.slice(offset, amt);
    return ab;
}