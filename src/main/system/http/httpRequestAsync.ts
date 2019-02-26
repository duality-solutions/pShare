import * as url from 'url'
import * as dns from 'dns'
import * as net from 'net'
import * as http from 'http'
import * as https from 'https'
import { streamToBufferAsync } from './streamToBufferAsync'
import { createCancellationToken, CancellationToken } from '../../../shared/system/createCancellationToken';
import { blinq } from 'blinq'
import * as isInSubnet from 'is-in-subnet';

const { IPv4: { isInSubnet: isInSubnetV4 }, IPv6: { isInSubnet: isInSubnetV6 } } = isInSubnet




const subnetsV4 = blinq(['0.0.0.0/8', '10.0.0.0/8', '100.64.0.0/10', '127.0.0.0/8',
    '169.254.0.0/16', '172.16.0.0/12', '192.0.0.0/24', '192.0.2.0/24', '192.88.99.0/24', '192.168.0.0/16',
    '198.18.0.0/15', '198.51.100.0/24', '203.0.113.0/24', '224.0.0.0/4', '240.0.0.0/4', '255.255.255.255/32']);
const subnetsV6 = blinq(['::/128', '::1/128', '::ffff:0:0/96', '::ffff:0:0:0/96', '64:ff9b::/96', '100::/64', '2001::/32',
    '2001:20::/28', '2001:db8::/32', '2002::/16', 'fc00::/7', 'fe80::/10', 'ff00::/8']);
const isPrivateOrReservedIpAddress =
    (ipAddr: string) => {
        const addressVersion = net.isIP(ipAddr);
        if (addressVersion === 0) {
            throw Error(`${ipAddr} is not a valid address`);
        }
        switch (addressVersion) {
            case 4:
                return subnetsV4.any(subnet => isInSubnetV4(ipAddr, subnet));
            case 6:
                return subnetsV6.any(subnet => isInSubnetV6(ipAddr, subnet));
            default:
                throw Error("unhandled ip version"); //could this ever happen?
        }

    };

const methodsWithBody = ["POST", "PATCH", "PUT"];

const isStream = (stream: any) =>
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function';
const isBuffer = (obj: any) =>
    obj != null &&
    obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj);
const isWriteable = (obj: any) => (typeof obj) === 'string' || isBuffer(obj);

function httpMethodAllowsBody(httpMethod: string) {
    return methodsWithBody.indexOf(httpMethod) >= 0;
}

interface ReqHeaders {
    [id: string]: string
}
interface RequestOpts {
    url: string
    headers?: ReqHeaders
    rejectUnsafeHosts?: boolean
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS"
    body?: any
}

async function getRequestOptionsAsync(opts: RequestOpts) {
    const parsedUrl = url.parse(opts.url);
    let httpLib;

    switch (parsedUrl.protocol) {
        case 'http:':
            httpLib = http;
            break;
        case 'https:':
            httpLib = https;
            break;
        default:
            throw Error(`incompatible protocol:${parsedUrl.protocol}`);
    }

    let requestOpts;


    const headers = {
        ...opts.headers,
        "Connection": "keep-alive",
        "Host": parsedUrl.hostname
    };

    if (typeof parsedUrl.hostname === 'undefined') {
        throw Error("could not get hostname from url " + opts.url)
    }

    const records = await dnsResolveAsync(parsedUrl.hostname);

    const addr = blinq(records).where(a => a.family === 4).orderBy(_ => Math.random()).select(r => r.address).firstOrDefault();

    if (!addr) {
        throw Error(`could not resolve hostname ${parsedUrl.hostname}`)
    }

    if (opts.rejectUnsafeHosts && isPrivateOrReservedIpAddress(addr)) {
        throw Error(`unsafe hostname detected : ${parsedUrl.hostname} (${addr})`);
    }

    const newUrlObj = { ...parsedUrl, hostname: addr, host: `${addr}${parsedUrl.port ? `:${parsedUrl.port}` : ""}` };


    requestOpts = {
        ...newUrlObj,
        timeout: 60000,
        headers: headers
    };
    //console.log(`request opts: ${JSON.stringify(requestOpts, null, 2)}`);
    return { requestOpts, httpLib };
}

export async function httpRequestResponseAsync(options: RequestOpts | string, cancellationToken: CancellationToken): Promise<http.IncomingMessage> {
    if (!options) {
        throw Error("no parameters supplied");
    }
    cancellationToken = cancellationToken || createCancellationToken();


    let opts: RequestOpts;
    if (typeof options === "string") {
        opts = { url: options, method: "GET" }
    } else {
        opts = options
    }

    opts = { ...opts, method: opts.method ? opts.method : "GET" }
    if (typeof opts.method === 'undefined') {
        throw Error("unexpected error")
    }

    const allowsBody = httpMethodAllowsBody(opts.method);
    const { requestOpts, httpLib } = await getRequestOptionsAsync(opts);
    return await new Promise((resolve, reject) => {

        const ro = { ...requestOpts, method: opts.method ? opts.method : "GET" }
        //requestOpts.method = opts.method || "GET";

        const request = httpLib.request(ro, (response) => {
            console.log("got response code " + response.statusCode);
            resolve(response);
        });

        if (cancellationToken) {
            cancellationToken.register(() => {
                request.abort();
                let error = Error("request was cancelled");
                //error.cancelled = true;
                reject(error);
            });
        }

        request.on("error", (err) => {
            if (!cancellationToken.isCancellationRequested) {
                //console.log("got error");
            }

            reject(err);
        });

        if (!allowsBody || !opts.body) {
            //console.log("no body... ending request");
            request.end();
        }
        else if (isStream(opts.body)) {
            //console.log("streaming body into request");
            opts.body.pipe(request, { end: true });
        }
        else if (isWriteable(opts.body)) {
            request.write(opts.body, undefined, () => request.end());
        }
        else {
            request.end();
        }
    });


}

interface RequestBufferResponse {
    responseBuffer: Buffer
    response: http.IncomingMessage
}

export async function httpRequestBufferAsync(opts: RequestOpts, cancellationToken: CancellationToken): Promise<RequestBufferResponse> {
    const response = await httpRequestResponseAsync(opts, cancellationToken);
    const buf = await streamToBufferAsync(response);
    return { responseBuffer: buf, response };
}

interface RequestStringResponse {
    responseString: string
    response: http.IncomingMessage
}


export async function httpRequestStringAsync(opts: RequestOpts, cancellationToken: CancellationToken): Promise<RequestStringResponse> {
    const { response, responseBuffer } = await httpRequestBufferAsync(opts, cancellationToken);

    return { responseString: responseBuffer.toString(), response };
}

function dnsResolveAsync(hostname: string): Promise<dns.LookupAddress[]> {
    return new Promise((resolve, reject) => {
        dns.lookup(hostname, { all: true, verbatim: true }, (err, records) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(records);
            }
        });
    });
}

