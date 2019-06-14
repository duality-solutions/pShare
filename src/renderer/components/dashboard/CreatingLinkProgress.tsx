import React, { FunctionComponent } from "react";
import { Box } from "../ui-elements/Box";
import { Text } from "../ui-elements/Text";

const blocks:number = 30
// const error: boolean = false
// const success: boolean = false

export interface CreatingLinkProgressStateProps {
}

export interface CreatingLinkProgressDispatchProps {
}

export type CreatingLinkProgressProps = CreatingLinkProgressStateProps & CreatingLinkProgressDispatchProps

export const CreatingLinkProgress:FunctionComponent <CreatingLinkProgressProps> = ({ }) => 
    <>
        <Box margin="38vh auto 0 auto">
            <Text fontSize="24px" fontWeight="600" margin="0 0 0 10px" color="#4a4a4a">Creating Link</Text>
            <Box padding="10px" display="flex" direction="row" justifyContent="start" margin="10px 0 0 0">
                {[...Array(blocks)].map((e, i) => <Box key={i} background={i%5==4 ? "#e7e7e7": "#2e77d0"}  width="10px" height="22px" borderRadius="3px" margin="0 5px 0 0"/>)}
            </Box>
        </Box>
    </>