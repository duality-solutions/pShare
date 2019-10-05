import { resourceScope } from "../../shared/system/redux-saga/resourceScope";

test("resourceScope", () => {
    var scope = resourceScope(
        () => ({ used: false, message: "hello" }),
        o => {
            o.used = true;
        }
    );
    let oo: any;
    let m: string | undefined;
    var it = scope.use(function*(o) {
        //console.log("scoped code running");
        oo = o;
        m = o.message;
        yield 666;
    });
    for (const x of it) {
        expect(m).toBe("hello");
        expect(x).toBe(666);
    }
    expect(oo).toBeDefined();
    expect(oo.used).toBeTruthy();
});
