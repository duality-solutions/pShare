import { call } from "redux-saga/effects";
import fsExtra from 'fs-extra';
import { entries } from "../../../shared/system/entries";
import * as path from 'path'
import { remote } from "electron";

export const { app } = remote
export function getOrCreateShareDirectoriesForUser(otherEndUser: string) {
    return call(function* () {
        const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");
        const userShareFolder = path.join(pathToShareDirectory, otherEndUser);
        const paths: UserSharePaths = {
            incoming: path.join(userShareFolder, "in"),
            outgoing: path.join(userShareFolder, "out"),
            temp: path.join(pathToShareDirectory, "temp")
        };
        for (const [, dir] of entries(paths)) {
            yield call(() => fsExtra.ensureDir(dir));
        }
        return paths;
    });
}
export interface UserSharePaths {
    incoming: string;
    outgoing: string;
    temp: string;
}
