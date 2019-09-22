import { FunctionComponent, useState, useRef, CSSProperties, useCallback } from "react";
import React from "react";
import { QRCode } from "../ui-elements/QRCode"
import { Text } from "../ui-elements/Text";
import { useOutsideAlerter } from "../../system/useOutsideAlerter";
import copyIcon from "../../assets/svgs/copy-32.svg"

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { delay } from "../../../shared/system/delay";
import { PickedDispatchProps } from "../../../renderer/system/PickedDispatchProps";
import { BdapActions } from "../../../shared/actions/bdap";

export interface BalanceIndicatorStateProps {
    balance: number
    walletAddress: string
    errorMessage?: string
    hideLinkWhenMinimized?: boolean
}
export type BalanceIndicatorDispatchProps = PickedDispatchProps<typeof BdapActions, "fundsDialogDismissed">
export type BalanceIndicatorProps = BalanceIndicatorStateProps & BalanceIndicatorDispatchProps
export const BalanceIndicator: FunctionComponent<BalanceIndicatorProps> = ({ balance, walletAddress, errorMessage, fundsDialogDismissed, hideLinkWhenMinimized }) => {
    const [visible, setVisible] = useState(false)
    const [copied, setCopied] = useState(false);
    const elemRef = useRef(null);

    const isVisible = visible || errorMessage;

    const cb = useCallback((ev: MouseEvent) => {
        if (isVisible) {
            setVisible(false)
            ev.preventDefault()
            ev.stopPropagation()
            fundsDialogDismissed()
        }
    }, [isVisible])
    useOutsideAlerter(elemRef, cb);
    const borderStyle = isVisible ? "solid 2px #ccc" : "none";

    const outerStyle: CSSProperties = {
        padding: '6px',
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        borderBottom: borderStyle,
        borderRight: borderStyle,
        backgroundColor: isVisible ? "#ffffff" : "none",
        borderBottomRightRadius: "8px"
    }
    return <>
        {((!hideLinkWhenMinimized) || isVisible) && <div ref={elemRef} style={outerStyle}>
            <Text margin="0">
                <span onClick={e => {
                    e.preventDefault();
                    console.log("balanceIndicator clicked");
                    const show = !isVisible;
                    setVisible(show)
                    if (!show) {
                        fundsDialogDismissed()
                    }
                }}
                    style={{ cursor: 'pointer', color: '#2e77d0' }}
                >Balance : {balance} credits</span>
            </Text>
            {isVisible && <>
                {errorMessage && <div style={{ textAlign: "center", color: "#f44", margin: "10px auto", width: "300px" }}>{errorMessage}</div>}
                <div style={{ textAlign: "center", color: "#4a4a4a" }}>
                    <QRCode
                        bgColor="#00000000"
                        fgColor="#4a4a4aff"
                        ecLevel="H"
                        minPadding={5}
                        minimumCellSize={2}
                        qrStyle="dots"
                        value={walletAddress}
                        size={150} />
                </div>
                <div style={{ fontFamily: '"Courier New", Courier, monospace', textAlign: "center", color: "#4a4a4a", margin: "10px", position: "relative" }}>
                    {copied && <div style={{ textAlign: "center", position: "absolute", left: 0, top: 0, width: "100%", height: "100%", backgroundColor: "#fff", color: "#f88", fontWeight: "bold" }}>COPIED TO CLIPBOARD</div>}
                    <span>{walletAddress} </span>
                    <CopyToClipboard text={walletAddress}
                        onCopy={async () => {
                            setCopied(true)
                            await delay(2000)
                            setCopied(false)
                        }}>
                        <img src={copyIcon} style={{ cursor: "pointer", verticalAlign: "middle" }} />
                    </CopyToClipboard>

                </div>
            </>}
        </div>}

    </>
}