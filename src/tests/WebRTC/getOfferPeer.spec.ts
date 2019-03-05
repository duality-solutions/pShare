import { getOfferPeer } from "../../renderer/webRtc/getOfferPeer";
import { createPromiseResolver } from "../../shared/system/createPromiseResolver";

test("getOfferPeer", async () => {
    const offerPeer = await getOfferPeer()
    const pr = createPromiseResolver<RTCSessionDescription>()
    offerPeer.once("sdp", (d: RTCSessionDescription) => pr.resolve(d))
    const sdp = await pr.promise;
    console.log(sdp)

})