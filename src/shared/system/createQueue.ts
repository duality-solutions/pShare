import { Queue as Q } from 'typescript-collections'

interface Queue<T> {
    enqueue: (item: T) => void;
    dequeue: () => T;
    readonly any: boolean;
    dequeueAll: () => Iterable<T>
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
        dequeueAll: function* () {
            let item: T | undefined
            while (typeof (item = q.dequeue()) !== 'undefined') {
                yield item
            }
        },
        get any(): boolean {
            return !q.isEmpty();
        }
    };
};
