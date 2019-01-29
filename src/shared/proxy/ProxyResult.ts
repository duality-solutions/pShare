interface ProxyResult<T> {
    result?: T;
    callId: string;
    error?: any;
}
export default ProxyResult