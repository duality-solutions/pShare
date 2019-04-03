import { httpRequestStringAsync } from "../../main/system/http/httpRequestAsync";
import { createCancellationTokenSource } from "../../shared/system/createCancellationTokenSource";

test("httpRequestStringAsync", async () => {
    const cts = createCancellationTokenSource()
    const { responseString } = await httpRequestStringAsync({ url: "https://www.google.com" }, cts.getToken())
    //console.log(responseString)
    expect(responseString.length).toBeGreaterThan(0)
})