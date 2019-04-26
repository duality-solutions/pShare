import { httpRequestStringAsync } from "../http/httpRequestAsync"
import { createCancellationToken, CancellationToken } from "../../../shared/system/createCancellationToken";
import { RpcClient } from "../../../main/RpcClient";

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
    async command(method: string, ...params: any[]) {
        const result = await this.call(method, ...params)

        return result
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

        if (response && response.responseString) {
            const rs = response.responseString
            const limit = 2000

            const output = rs.length > limit ? `${rs.substr(0, limit)}...` : rs;

            const rpcDebugMsg=`RPC request : ${JSON.stringify(body)}\nRPC response : ${output}`
            console.log(rpcDebugMsg)

        }

        if (response.response.headers["content-type"] === "application/json") {
            const resObj = JSON.parse(response.responseString)
            if (resObj.error) {
                throw Error(resObj.error.message)
            } else if (typeof resObj.result !== 'undefined') {
                return resObj.result
            }
        }

        throw Error(response.responseString)
    }
}
