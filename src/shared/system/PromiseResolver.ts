export type ResolvedState = "resolved" | "rejected" | "cancelled"

export interface PromiseResolver<T> {
    resolve: (val: T) => void;
    reject: (err: any) => void;
    cancel: () => void
    readonly state: ResolvedState
    readonly complete: boolean
    promise: Promise<T>;
}
