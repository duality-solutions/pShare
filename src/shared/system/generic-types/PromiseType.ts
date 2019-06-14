export type PromiseType<T> = T extends Promise<infer U> ? U : T extends (...args: any[]) => Promise<infer U> ? U : T;
