import { keys } from "./entries";

export function mergePropertiesAsReadOnly<T>(src: Partial<T>, target: T) {
    const propertyDescriptors = keys(src).aggregate({} as PropertyDescriptorMap & ThisType<any>, (acc, curr) => {
        acc[curr as string] = {
            value: src[curr],
            writable: false,
            enumerable: true,
            configurable: false
        };
        return acc;
    });

    Object.defineProperties(target, propertyDescriptors);
}


