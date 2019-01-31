import { app } from 'electron';
import startDynamicd from './startDynamicd';
import BitcoinClient from 'bitcoin-core';
import delay from '../shared/system/delay';
import { lazy } from './lazy';
interface BitcoinClientOptions {
    host: string,
    port: string,
    username: string,
    password: string
}
const bitcoinClientLazy = lazy(() => getBitcoinClient_Impl())

export function getBitcoinClient() {
    return bitcoinClientLazy.get()
}

async function getBitcoinClient_Impl() {
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
    let errorMessageShown = false;
    //try every 2s until we get a non-error
    for (; ;) {
        try {
            await client.command("getinfo");
            break;
        }
        catch (err) {
            //console.error(err);
            if (!errorMessageShown) {
                console.error(isDevelopment ?
                    "error when attempting rpc call, will try again every 2s until success. did you start dynamicd in docker?" :
                    "error when attempting rpc call, will try again every 2s until success.")
                errorMessageShown = true;
            }
            await delay(2000);
            continue;
        }
    }
    console.log("rpc call successful. client is ready")
    //client is ready to be used
    return client;
}

