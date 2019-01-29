interface ProxyResult<T> {
    result?: T;
    callId: number;
    error?: any;
}
export default ProxyResult