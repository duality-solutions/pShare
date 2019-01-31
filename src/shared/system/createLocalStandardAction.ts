import { createStandardAction } from 'typesafe-actions';
import { StringType, PayloadCreator, FsaBuilder, B, NoArgCreator } from 'typesafe-actions/dist/types';
interface LocalMeta {
    scope: string;
}
export const createLocalStandardAction = <T extends StringType>(actionName: T) => {
    const builder = createStandardAction(actionName);
    return <TP extends any = void, TR=TP extends void ? NoArgCreator<T> : PayloadCreator<T, TP>>(): TR => {
        const ac: FsaBuilder<T, B<TP>, B<LocalMeta>> = builder<TP, LocalMeta>();

        return ((payload: TP) => ac(payload, { scope: "local" })) as any as TR;
    };
};
