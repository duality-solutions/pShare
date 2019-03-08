import React, { FunctionComponent } from "react";

export interface RtcPlaygroundStateProps {
    text: string
}
export interface RtcPlaygroundDispatchProps {
    push: (pathname: string) => void
    createOffer: () => void
    createAnswer: (offerSdp: string) => void
    textChanged: (val: string) => void
}
export type RtcPlaygroundProps = RtcPlaygroundStateProps & RtcPlaygroundDispatchProps

export const RtcPlayground: FunctionComponent<RtcPlaygroundProps> = ({ createOffer, createAnswer, text, textChanged }) =>
    <>
        <h1>rtc playground</h1>
        <div>
            <button onClick={() => createOffer()}>create offer</button>
            <button onClick={() => createAnswer((document.getElementById("txtarea") as HTMLTextAreaElement)!.value!)}>create answer</button>
        </div>
        <div>
            <textarea style={({ width: "500px", height: "400px" })} id="txtarea" value={text} onChange={e => textChanged(e.currentTarget.value)}></textarea>
        </div>
    </>

