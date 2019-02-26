import { httpRequestStringAsync } from "../../main/system/http/httpRequestAsync";
import { createCancellationToken } from "../../shared/system/createCancellationToken";

test("httpRequestStringAsync", async () => {
    const ct = createCancellationToken()
    const { responseString } = await httpRequestStringAsync({ url: "https://www.google.com" }, ct)
    console.log(responseString)
    expect(responseString.length).toBeGreaterThan(0)
})