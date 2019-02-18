
export interface ValidationTest<T> {
    test: (value: T) => boolean | Promise<boolean>;
    message: string;
    testsOnSuccess?: ValidationTest<T>[];
}
