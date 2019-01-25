export const deepMerge = <T>(a: T, b: T): T => mergeObjects({} as T, a, b)

const mergeObjects = <T>(target: T, ...sources: T[]): T => {
    if (!sources.length) {
        return target;
    }
    const [source, ...remainingSources] = sources;
    if (source === undefined) {
        return target;
    }

    if (isMergebleObject(target) && isMergebleObject(source)) {
        keys(source).forEach(function (key: keyof T) {
            if (isMergebleObject(source[key])) {
                if (!target[key]) {
                    target[key] = {} as T[keyof T];
                }
                mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        });
    }

    return mergeObjects(target, ...remainingSources);
};

const isObject = (item: any): boolean => {
    return item !== null && typeof item === 'object';
};

const isMergebleObject = (item: any): boolean => {
    return isObject(item) && !Array.isArray(item);
};

function keys<O>(o: O) {
    return Object.keys(o) as (keyof O)[];
}