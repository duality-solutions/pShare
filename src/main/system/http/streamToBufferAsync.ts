import { Buffer } from 'buffer'
import { Stream } from 'stream'
import { CancellationToken, CancellationTokenRegistration } from '../../../shared/system/createCancellationTokenSource';


export async function streamToBufferAsync(stream: Stream, cancellationToken: CancellationToken): Promise<Buffer> {
    let cancellationTokenRegistration: CancellationTokenRegistration
    const prom = new Promise<Buffer>((resolve, reject) => {
        let buffers: Buffer[] = [];
        stream.on('data', (buffer) => {
            buffers.push(buffer);
        });
        stream.on("end", r => {
            resolve(Buffer.concat(buffers));
        });
        stream.on("error", e => reject(e));
        cancellationTokenRegistration = cancellationToken.register(() => reject("cancelled"));
    });

    try {
        return await prom
    } finally {
        cancellationTokenRegistration!.unregister()
    }
}
