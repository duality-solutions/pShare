import { StringType,  FsaBuilder, B,  ActionCreator, MapBuilder } from 'typesafe-actions/dist/types';
import { CreateStandardAction } from 'typesafe-actions/dist/create-standard-action';


export function createLocalStandardAction<T extends StringType>(
    actionType: T
): CreateStandardAction<T> {
    validateActionType(actionType);

    function constructor<P, M = void>(): FsaBuilder<T, B<P>, B<M>> {
        return withType(actionType, type => (payload?: P, meta?: M) => ({
            type,
            payload,
            meta: (typeof meta === 'undefined' ? { scope: "local" } : { ...meta, scope: "local" }) as any
        })) as FsaBuilder<T, B<P>, B<M>>;
    }

    function map<R, P, M>(
        fn: (payload?: P, meta?: M) => R
    ): MapBuilder<T, B<R>, B<P>, B<M>> {
        return withType(actionType, type => (payload?: P, meta?: M) =>
            Object.assign(fn(payload, meta), { type })
        ) as MapBuilder<T, B<R>, B<P>, B<M>>;
    }

    return Object.assign(constructor, { map });
}
function validateActionType(arg: any, idx: number = 1): void {
    if (arg == null) {
        throw new Error(`Argument (#${idx}) is missing`);
    } else {
        if (typeof arg !== 'string' && typeof arg !== 'symbol') {
            throw new Error(`Argument (#${idx}) should be of type: string | symbol`);
        }
    }
}

function withType<T extends StringType, AC extends ActionCreator<T>>(
    type: T,
    constructorFunction?: (type: T) => AC
): AC {
    const actionCreator: AC =
        constructorFunction != null
            ? constructorFunction(type)
            : ((() => ({ type })) as AC);
    return Object.assign(actionCreator, { getType: () => type });
}