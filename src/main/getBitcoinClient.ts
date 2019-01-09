import { app } from 'electron';
import startDynamicd from './startDynamicd';
import BitcoinClient from 'bitcoin-core';
const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))
interface BitcoinClientOptions {
    host: string,
    port: string,
    username: string,
    password: string
}
export async function getBitcoinClient() {
    const processInfo = await startDynamicd();
    app.on('before-quit', async () => {
        //console.log("before quit");
        processInfo.dispose();
        console.log("dynamicd processInfo disposed");
    });
    const client = await createBitcoinClient({
        host: "localhost",
        port: "33650",
        username: processInfo.rpcUser,
        password: processInfo.rpcPassword
    });
    return client;
}
const isDevelopment = process.env.NODE_ENV === 'development'
async function createBitcoinClient(opts: BitcoinClientOptions) {
    const client = new BitcoinClient(opts);
    //try every 2s until we get a non-error
    for (; ;) {
        try {
            await client.command("getinfo");
            break;
        }
        catch (err) {
            //console.error(err);
            console.error(isDevelopment ?
                "error when attempting rpc call, trying again in 2s. did you start dynamicd in docker?" :
                "error when attempting rpc call, trying again in 2s")
            await delay(2000);
            continue;
        }
    }
    //client is ready to be used
    return client;
}
