import { Queue as Q } from 'typescript-collections'

interface Queue<T> {
    enqueue: (item: T) => void;
    dequeue: () => T;
    readonly any: boolean;
}
export const createQueue = <T>(): Queue<T> => {
    const q = new Q<T>()
    return {
        enqueue: (item: T) => q.enqueue(item),
        dequeue: () => {
            const item = q.dequeue()
            if (typeof item === 'undefined') {
                throw Error("queue is empty");
            }
            return item;
        },
        get any(): boolean {
            return !q.isEmpty();
        }
    };
};
