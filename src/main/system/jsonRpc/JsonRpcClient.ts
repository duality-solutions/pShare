// import { httpRequestStringAsync } from "../http/httpRequestAsync"
import { CancellationToken } from "../../../shared/system/createCancellationTokenSource";
import { RpcClient } from "../../../main/RpcClient";
const isDevelopment = process.env.NODE_ENV === 'development'
import { RpcCommandOptions, TimeoutOptions, RetryOptions } from "./RpcCommandOptions";
import { post, Response } from 'got'



export interface RpcClientOptions {
    host: string
    port: string
    username: string
    password: string
    timeout?: number | TimeoutOptions
    retry?: number | RetryOptions
}
interface JsonRpcRequestBody {
    jsonrpc: string;
    id: string;
    method: string;
    params: any[];
}

export default class JsonRpcClient implements RpcClient {
    private id: number;
    private serviceUrl: string
    private requestHeaders: Record<string, string>
    private cancellationToken: CancellationToken
    private opts: RpcClientOptions
    constructor(opts: RpcClientOptions, cancellationToken: CancellationToken) {
        this.opts = opts
        this.cancellationToken = cancellationToken
        this.serviceUrl = `http://${opts.host}:${opts.port}/`
        const basicAuthValue = Buffer.from(`${opts.username}:${opts.password}`).toString("base64");
        const auth = `Basic ${basicAuthValue}`
        this.requestHeaders = { "Authorization": auth }
        this.id = 0;
    }
    async command(methodOrOptions: string | RpcCommandOptions, ...params: any[]) {
        const options = typeof methodOrOptions === "string" ? {} : methodOrOptions
        const method = typeof methodOrOptions === "string" ? methodOrOptions : params[0]
        const args = typeof methodOrOptions === "string" ? params : params.slice(1)
        const result = await this.call(options, method, ...args)

        return result
    }
    private async call(options: RpcCommandOptions, method: string, ...params: any[]) {
        let body: JsonRpcRequestBody = this.createJsonRpcBody(method, params);

        return await this.getJsonRpcResponse(options, body, this.cancellationToken);
    }

    private createJsonRpcBody(method: string, params: any[]): JsonRpcRequestBody {
        return {
            jsonrpc: "1.0",
            id: `${this.id++}`,
            method,
            params: params || []
        }
    }

    private async getJsonRpcResponse(options: RpcCommandOptions, body: JsonRpcRequestBody, cancellationToken: CancellationToken) {
        const timeout =
            options.timeout == null && this.opts.timeout == null
                ? undefined
                : options.timeout != null
                    ? options.timeout
                    : this.opts.timeout
        const retry =
            options.retry == null && this.opts.retry == null
                ? undefined
                : options.retry != null
                    ? options.retry
                    : this.opts.retry
        // const timeoutToken = cancellationToken.createLinkedTokenSource(timeout).getToken();
        if (!isDevelopment) {
            console.log(`Starting RPC request : ${JSON.stringify(body)}`)
        }
        let gotResponse: Response<string>;
        try {
            const postReq = post(this.serviceUrl, {
                headers: this.requestHeaders,
                timeout: timeout,
                body: JSON.stringify(body),
                retry: retry
            });
            const registration = cancellationToken.register(() => postReq.cancel())
            try {
                gotResponse = await postReq
            } finally {
                registration.unregister()
            }
        } catch (err) {
            if (err.name === "CancelError") {
                throw err
            }
            if (err.headers && err.headers["content-type"] === "application/json") {
                const returnedErr = JSON.parse(err.body)
                if (returnedErr.error) {
                    throw Error(returnedErr.error.message)
                }
            }
            throw err
        }
        if (gotResponse.headers["content-type"] === "application/json") {
            return JSON.parse(gotResponse.body).result
        }

        throw Error(`Unexpected content-type : ${gotResponse.headers["content-type"]}`)

    }
}
