import { FunctionComponent } from "react";
import React from "react";
import { Text } from "../ui-elements/Text";

interface LinkDisplayNameProps {
    disabled?: boolean;
    displayName: string;
}

export const LinkDisplayName: FunctionComponent<LinkDisplayNameProps> = ({ disabled, displayName }) => <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: "30px" }}>
    <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
        <Text margin="0 0.2em 0 0.5em" disabled={disabled}>{displayName.split(' ')[0]}</Text>
        <Text margin="0 0.2em" fontWeight="bold" disabled={disabled}>{displayName.split(' ')[1]}</Text>
    </div>
</div>;

