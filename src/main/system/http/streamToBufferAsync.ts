import { Buffer } from 'buffer'
import { Stream } from 'stream';

export function streamToBufferAsync(stream: Stream) {
    return new Promise((resolve, reject) => {
        let buffers: Buffer[] = [];
        stream.on('data', (buffer) => {
            buffers.push(buffer);
        });
        stream.on("end", r => {
            resolve(Buffer.concat(buffers));
        });
        stream.on("error", e => reject(e));
    });
}
