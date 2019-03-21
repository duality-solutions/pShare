import { httpRequestStringAsync } from "../http/httpRequestAsync"
import { createCancellationToken, CancellationToken } from "../../../shared/system/createCancellationToken";

export interface RpcClientOptions {
    host: string
    port: string
    username: string
    password: string
    timeout?: number
}
interface JsonRpcRequestBody {
    jsonrpc: string;
    id: string;
    method: string;
    params: any[];
}
export default class JsonRpcClient {
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
    async command(method: string, ...params: any[]) {
        const response = await this.call(method, ...params)
        if (response.error) {
            throw (Error(`error in RPC response : ${JSON.stringify(response.error, null, 2)}`))
        }
        return response.result
    }
    private async call(method: string, ...params: any[]) {
        let body: JsonRpcRequestBody = this.createJsonRpcBody(method, params);
        return await this.getJsonRpcResponse(body, this.cancellationToken);
    }

    private createJsonRpcBody(method: string, params: any[]): JsonRpcRequestBody {
        return {
            jsonrpc: "1.0",
            id: `${this.id++}`,
            method,
            params: params || []
        }
    }

    private async getJsonRpcResponse(body: JsonRpcRequestBody, cancellationToken: CancellationToken) {
        const timeoutToken = createCancellationToken(this.opts.timeout, cancellationToken);
        const response =
            await httpRequestStringAsync({
                body: JSON.stringify(body),
                url: this.serviceUrl,
                headers: this.requestHeaders,
                method: "POST",
                rejectUnsafeHosts:
                    false
            }, timeoutToken)

        const responseStatusCategory = response.response.statusCode ? ((response.response.statusCode / 100) >> 0) : 0;
        if (responseStatusCategory === 2) {
            switch (response.response.headers["content-type"]) {
                case "application/json":
                    return JSON.parse(response.responseString);
                default:
                    return response.responseString
            }
        }
        switch (response.response.headers["content-type"]) {
            case "application/json":
                const res = JSON.parse(response.responseString);
                const errorMessage = res.error ? res.error.message : response.responseString;
                throw Error(errorMessage);
            default:
                throw Error(response.responseString)
        }




    }
}
