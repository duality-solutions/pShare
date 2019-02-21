//import { createBdapAccountSaga, createRawBdapAccount } from "../../main/sagas/createBdapAccountSaga";
import { OnboardingActions } from "../../shared/actions/onboarding";
//import { cloneableGenerator } from "redux-saga/utils";
import { expectSaga } from 'redux-saga-test-plan'
import { createBdapAccountSaga, createRawBdapAccount, activateAccount, checkBdapAccountCreated } from "../../main/sagas/createBdapAccountSaga";
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from "redux-saga-test-plan/providers";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";

describe("createBdapAccountSaga", function () {
    //const generator = cloneableGenerator(createBdapAccountSaga)();
    //generator.next().
    const userInfo: GetUserInfo = {
        _id: "a",
        common_name: "d",
        dht_publickey: "c",
        domain_component: "d",
        expired: false,
        expires_on: 123,
        link_address: "e",
        object_full_path: "f",
        object_id: "g",
        object_type: "h",
        organization_name: "i",
        organizational_unit: "j",
        public: 3,
        time: 123,
        txid: "someTxId",
        version: 123,
        wallet_address: "k"
    }
    const createdAction = OnboardingActions.bdapAccountCreated("u")
    const createBdapAccount = OnboardingActions.createBdapAccount({ commonName: "d", token: "t", userName: "u" })

    it("happy path", async () => {
        await expectSaga(createBdapAccountSaga, false)
            .provide([
                [matchers.call.fn(createRawBdapAccount), "somerawHexTx"],
                [matchers.call.fn(activateAccount), "someTxId"],
                [matchers.call.fn(checkBdapAccountCreated), [true, userInfo]],
            ])
            .put(createdAction)
            .dispatch(createBdapAccount)
            .silentRun()
    })
    it("user taken", async () => {
        await expectSaga(createBdapAccountSaga, false)
            .provide([
                [matchers.call.fn(createRawBdapAccount), "somerawHexTx"],
                [matchers.call.fn(activateAccount), "someTxId"],
                [matchers.call.fn(checkBdapAccountCreated), throwError(Error("txid of user does not match supplied value"))],
            ])
            .put(OnboardingActions.resetOnboarding())
            .dispatch(createBdapAccount)
            .silentRun()
    })
})
