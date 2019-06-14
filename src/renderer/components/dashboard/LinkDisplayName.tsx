import { FunctionComponent } from "react";
import React from "react";
import { Text } from "../ui-elements/Text";

interface LinkDisplayNameProps {
    disabled?: boolean;
    displayName: string;
    fontSize?: string
}

export const LinkDisplayName: FunctionComponent<LinkDisplayNameProps> = ({ disabled, displayName, fontSize }) => {

    const userNameParts = displayName.split(' ')
    const lastName = (userNameParts.length > 1) ? userNameParts[userNameParts.length - 1] : ""
    const firstName = userNameParts.length > 1 ? userNameParts.slice(0, -1).join(' ') : userNameParts[0]


    return <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: "30px" }}>
        <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
            <Text margin="0 0.2em 0 0.5em" fontSize={fontSize} disabled={disabled}>{firstName}</Text>
            <Text margin="0 0.2em" fontSize={fontSize} fontWeight="bold" disabled={disabled}>{lastName}</Text>
        </div>
    </div>;
};

