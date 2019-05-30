export interface TimeoutOptions {
    /**
     * Starts when a socket is assigned and ends when the hostname has been resolved. Does not
     * apply when using a Unix domain socket.
     */
    lookup?: number;
    /**
     * Starts when `lookup` completes (or when the socket is assigned if lookup does not apply
     * to the request) and ends when the socket is connected.
     */
    connect?: number;
    /**
     * Starts when `connect` completes and ends when the handshaking process completes (HTTPS
     * only).
     */
    secureConnect?: number;
    /**
     * Starts when the socket is connected. See [request.setTimeout](https://nodejs.org/api/http.html#http_request_settimeout_timeout_callback).
     */
    socket?: number;
    /**
     * Starts when the request has been written to the socket and ends when the response headers
     * are received.
     */
    response?: number;
    /**
     * Starts when the socket is connected and ends with the request has been written to the
     * socket.
     */
    send?: number;
    /**
     * Starts when the request is initiated and ends when the response's end event fires.
     */
    request?: number;
}

type RetryFunction = (retry: number, error: any) => number;

export interface RetryOptions {
    retries?: number | RetryFunction;
    methods?: Array<'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE'>;
    statusCodes?: Array<408 | 413 | 429 | 500 | 502 | 503 | 504>;
    maxRetryAfter?: number;
    /**
     * Allowed error codes.
     */
    errorCodes?: string[];
}

export interface RpcCommandOptions {
    timeout?: TimeoutOptions | number;
    retry?: RetryOptions | number
}
