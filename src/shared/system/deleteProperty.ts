import { Omit } from "./generic-types/Omit";



export const deleteProperty = <T, K extends keyof T>(
    obj: T,
    id: K
): Omit<T, K> => {
    const { [id]: deleted, ...newState } = obj;
    return newState as Omit<T, K>;
};
