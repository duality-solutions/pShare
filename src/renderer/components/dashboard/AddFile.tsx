import { FunctionComponent, useState } from "react";
import React from "react";
import { Box } from "../ui-elements/Box";
import { CloseIcon, AddLinksIcon } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";
import Container from "../ui-elements/Container";
import { FilePathInfo } from "../../../shared/types/FilePathInfo";
import { Dropzone, DropzoneError } from "../ui-elements/Dropzone";
import { maximumFileSize } from "../../../shared/system/maximumFileSize";



export interface AddFileStateProps {
    linkedUserCommonName: string
}

export interface AddFilesDispatchProps {
    close: () => void
    filesSelected: (files: FilePathInfo[]) => void
}

export type AddFileProps = AddFileStateProps & AddFilesDispatchProps



export const AddFile: FunctionComponent<AddFileProps> = ({ close, filesSelected, linkedUserCommonName }) => {
    // react hooks FTW!!!!
    const [error, setError] = useState<DropzoneError | undefined>(undefined)
    const userNameParts = linkedUserCommonName.split(' ')
    const lastName = (userNameParts.length > 1) ? userNameParts[userNameParts.length - 1] : ""
    const firstName = userNameParts.length > 1 ? userNameParts.slice(0, -1).join(' ') : userNameParts[0]
    const filesSelectedHandler = (files: FilePathInfo[]) => {
        if (files.some(f => f.size > maximumFileSize)) {
            setError({ title: "File too large!", message: "please select or drag a file that is no larger than 3gb" })
            return
        }
        filesSelected(files)
    }
    return <>
        <Box background="#fafafa" minHeight="90vh" width="100%" margin="18px" border="solid 1px #e9e9e9" borderRadius="23px" padding="1.5em 1em">
            <Box display="flex" direction="row" width="100%" justifyContent="space-between" margin="0 0 1em 0">
                <Box margin="0" padding="10px" borderRadius="11px" height="56px" background="#efefef" width="auto">
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Text margin="10px 0 0 0" align="center" fontSize="0.8em" fontWeight="600">Sending&nbsp;file&nbsp;to:&nbsp;</Text>
                        {/* <LinkDisplayName fontSize="0.8em" displayName={linkedUserCommonName} /> */}
                        <Text margin="10px 0 0 0" align="center" fontSize="0.8em">&nbsp;{firstName}&nbsp;</Text>
                        <Text margin="10px 0 0 0" align="center" fontSize="0.8em" fontWeight="600">{lastName}</Text>
                    </div>
                </Box>
                <Text margin="0" fontSize="0.9em">close <CloseIcon margin="0" onClick={() => close()} /> </Text>
            </Box>
            <Container height="50vh" margin="10% 0 0 0">
                <Box direction="column" align="center" width="100%">
                    <Box direction="column" width="500px" align="center" margin="0 auto 0 auto">
                        <Text margin="0" color="#4a4a4a" fontSize="1.4em" fontWeight="600">
                            <AddLinksIcon width="40px" height="30px" margin="0" /> Add file</Text>
                        <Dropzone error={error} filesSelected={filesSelectedHandler} ></Dropzone>
                    </Box>
                </Box>
                <Text align="center" fontSize="0.8em" margin="5em" color="#4a4a4a"> File size limit: 3gb</Text>
            </Container>
        </Box>
    </>;
}


