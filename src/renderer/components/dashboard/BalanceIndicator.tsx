import { FunctionComponent, useState, useRef, CSSProperties, useCallback } from "react";
import React from "react";
import { QRCode } from "../ui-elements/QRCode"
import { Text } from "../ui-elements/Text";
import { useOutsideAlerter } from "../../system/useOutsideAlerter";
import copyIcon from "../../assets/svgs/copy-32.svg"

export interface BalanceIndicatorStateProps {
    balance: number
    walletAddress: string
}
export interface BalanceIndicatorDispatchProps {

}
export type BalanceIndicatorProps = BalanceIndicatorStateProps & BalanceIndicatorStateProps
export const BalanceIndicator: FunctionComponent<BalanceIndicatorProps> = ({ balance, walletAddress }) => {
    const [visible, setVisible] = useState(false)
    const borderStyle = visible ? "solid 2px #ccc" : "none";
    const elemRef = useRef(null);

    const cb = useCallback((ev: MouseEvent) => {
        if (visible) {
            setVisible(false)
            ev.preventDefault()
            ev.stopPropagation()
        }
    }, [visible])
    useOutsideAlerter(elemRef, cb);
    const outerStyle: CSSProperties = {
        padding: '6px',
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        borderBottom: borderStyle,
        borderRight: borderStyle,
        backgroundColor: visible ? "#ffffff" : "none",
        borderBottomRightRadius: "8px"
    }
    return <>
        <div ref={elemRef} style={outerStyle}>
            <Text margin="0">
                <span onClick={e => {
                    e.preventDefault();
                    console.log("balanceIndicator clicked");
                    setVisible(!visible)
                }}
                    style={{ cursor: 'pointer', color: '#2e77d0' }}
                >Balance : {balance} credits</span>
            </Text>
            {visible && <>
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
                <div style={{ textAlign: "center", color: "#4a4a4a", marginLeft:"10px",marginRight:"10px" }}>
                    {walletAddress} <img src={copyIcon}/>
                    
                </div>
            </>}
        </div>

    </>
}