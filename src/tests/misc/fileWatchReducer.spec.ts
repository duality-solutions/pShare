import { fileWatch } from "../../shared/reducers";
import { FileWatchActions } from "../../shared/actions/fileWatch";

test("fileWatch reducer", () => {
    const defaultState = fileWatch(undefined, { type: "" } as any);
    const newState = fileWatch(
        defaultState,
        FileWatchActions.filesChanged([
            {
                type: "added",
                file: {
                    direction: "out",
                    path: "/a/b/c",
                    relativePath: "b/c",
                    sharedWith: "monkeyMan",
                },
            },
            {
                type: "added",
                file: {
                    direction: "out",
                    path: "/a/b/c/d",
                    relativePath: "b/c/d",
                    sharedWith: "monkeyMan",
                },
            },
            {
                type: "added",
                file: {
                    direction: "in",
                    path: "/a/b/c/d",
                    relativePath: "b/c/d",
                    sharedWith: "monkeyMan",
                },
            },
            {
                type: "unlinked",
                file: {
                    direction: "out",
                    path: "/a/b/c/d",
                    relativePath: "b/c/d",
                    sharedWith: "monkeyMan",
                },
            },
            {
                type: "unlinked",
                file: {
                    direction: "out",
                    path: "/a/b/c",
                    relativePath: "b/c",
                    sharedWith: "monkeyMan",
                },
            },
            {
                type: "unlinked",
                file: {
                    direction: "out",
                    path: "/a/b/c",
                    relativePath: "b/c/foo",
                    sharedWith: "monkeyMan",
                },
            },
        ])
    );
    expect(newState).toEqual({
        users: {
            monkeyMan: {
                in: {
                    "b/c/d": {
                        direction: "in",
                        path: "/a/b/c/d",
                        relativePath: "b/c/d",
                        sharedWith: "monkeyMan",
                    },
                },
                out: {},
            },
        },
    });
});
