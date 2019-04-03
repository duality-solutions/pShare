export type ResolvedState = "resolved" | "rejected" | "cancelled"

export interface PromiseResolver<T=void> {
    resolve: (val: T) => void;
    reject: (err: any) => void;
    cancel: () => void
    readonly state: ResolvedState
    readonly complete: boolean
    promise: Promise<T>;
}
