export const deepFreeze = <T>(o: T) => {
    Object.freeze(o);
    (Object.keys(o) as Array<keyof T>)
        .filter(prop => o.hasOwnProperty(prop)
            && o[prop] !== null
            && typeof o[prop] !== 'undefined'
            && (typeof o[prop] === "object" || typeof o[prop] === "function")
            && !Object.isFrozen(o[prop]))
        .forEach(prop => {
            deepFreeze(o[prop]);
        });
};
