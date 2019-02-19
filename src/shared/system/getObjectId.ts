export const getObjectId = (() => {
    let currentId = 0;
    const map = new WeakMap<{}, number>();
    return (object: {}) => {
        if (!map.has(object)) {
            map.set(object, ++currentId);
        }
        return map.get(object);
    };
})();
