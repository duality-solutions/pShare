import { httpRequestStringAsync } from "../../main/system/http/httpRequestAsync";
import { createCancellationToken } from "../../shared/system/createCancellationToken";

test("httpRequestStringAsync", async () => {
    const ct = createCancellationToken()
    const str = await httpRequestStringAsync({ url: "https://www.google.com" }, ct)
    console.log(str)
    expect(str.length).toBeGreaterThan(0)
})