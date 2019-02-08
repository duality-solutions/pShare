import { History } from "history";
import { fixRouterMiddleware } from "./fixRouterMiddleware";
import { routerMiddleware } from "connected-react-router";

export function createRouterMiddleware(history: History<any>) {
    return fixRouterMiddleware(routerMiddleware(history));
}