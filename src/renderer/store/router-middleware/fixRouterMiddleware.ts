import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from "redux";
import { LOCATION_CHANGE } from "connected-react-router";
import { Subject } from "rxjs";
import { filter, groupBy, flatMap } from "rxjs/operators";


export const fixRouterMiddleware = (routerMiddleware: Middleware): Middleware => {
    /**
     * gobbles the first LOCATION_CHANGE action if it's a POP action, as this action 
     * interferes with navigation persistence
     */
    type SubjectType = [MiddlewareAPI<Dispatch<AnyAction>, any>, Dispatch<AnyAction>, AnyAction]
    const action$ = new Subject<SubjectType>();

    action$
        .pipe(
            groupBy(([, , { type }]) => type),
            flatMap(g =>
                g.key !== LOCATION_CHANGE
                    ? g
                    : g.pipe(
                        filter(([, , { payload: { action: routerAction } }], idx) => idx !== 0 || routerAction !== "POP")
                    )),
        )
        .subscribe(([store, next, action]) => routerMiddleware(store)(next)(action))

    return store => next => (action: AnyAction) => action$.next([store, next, action])

}