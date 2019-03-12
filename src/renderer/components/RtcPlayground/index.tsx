import React, { FunctionComponent } from "react";
import { Dropzone } from "../../containers/RtcPlayground/Dropzone";
import { Link } from "react-router-dom";
import { appRoutes } from "../../../renderer/routes/appRoutes";

export interface RtcPlaygroundStateProps {
    text: string
}
export interface RtcPlaygroundDispatchProps {
    push: (pathname: string) => void
    createOffer: () => void
    createAnswer: () => void
    setAnswerFromRemote: () => void
    textChanged: (val: string) => void
}
export type RtcPlaygroundProps = RtcPlaygroundStateProps & RtcPlaygroundDispatchProps

export const RtcPlayground: FunctionComponent<RtcPlaygroundProps> = ({ createOffer, createAnswer, text, textChanged, setAnswerFromRemote }) =>
    <>
        <h1>rtc playground</h1>
        <p> <Link to={appRoutes.passwordCreate.path}>back to app</Link></p>

        <div>
            {/* <button onClick={() => createOffer()}>create offer</button> */}
            <button onClick={() => createAnswer()}>create answer</button>
            <button onClick={() => setAnswerFromRemote()}>set answer from remote</button>
        </div>
        <div>
            <textarea style={({ width: "500px", height: "400px" })} id="txtarea" value={text} onChange={e => textChanged(e.currentTarget.value)}></textarea>
        </div>
        <Dropzone />
    </>

