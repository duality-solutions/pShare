export interface LinkMessageEnvelope<T> {
    type: string;
    // sessionDescription: any;
    payload: T;
    timestamp: number;
    id: string;
}


