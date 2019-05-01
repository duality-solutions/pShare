import { FunctionComponent, useState } from "react";
import React from "react";
import man from "../../assets/man.svg";
import { Box } from "../ui-elements/Box";
import { LinkDisplayName } from "./LinkDisplayName";
import { UserListAvatar, CloseIcon, BtnAddLinksIcon, DocumentSvg } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";
import { SharedButton, DownloadButton } from "../ui-elements/Button";
import { Divider } from "../ui-elements/Divider";
import { FilesList, FilesListItem } from "../ui-elements/Dashboard";
import { SharedFile } from "../../../shared/types/SharedFile";
import { blinq } from "blinq";
import { PublicSharedFile } from "../../../shared/types/PublicSharedFile";

export interface SharedFilesStateProps {
    outFiles: SharedFile[],
    linkedUserCommonName?: string
    downloadableFiles: PublicSharedFile[]
}
export interface SharedFilesDispatchProps {
    //push: (pathname: string) => void
    close: () => void
    shareNewFile: () => void
}
export type SharedFilesProps = SharedFilesStateProps & SharedFilesDispatchProps
export const SharedFiles: FunctionComponent<SharedFilesProps> = ({ close, shareNewFile, outFiles, linkedUserCommonName, downloadableFiles }) => {
    const [currentView, setCurrentView] = useState<"shared" | "downloads">("shared")
    return <>
        <Box background="#fafafa" minHeight="90vh" width="100%" margin="18px" border="solid 1px #e9e9e9" borderRadius="23px" padding="1.5em 1em">
            <Box display="flex" direction="row" width="100%" justifyContent="space-between" margin="0 0 1em 0">
                <div style={{ display: 'flex' }}><UserListAvatar src={man} />
                    <LinkDisplayName displayName={linkedUserCommonName || ""} />
                </div>
                <div style={{ display: 'flex', }}>
                    <SharedButton onClick={() => setCurrentView("shared")} white={currentView !== "shared"} />
                    <DownloadButton onClick={() => setCurrentView("downloads")} white={currentView !== "downloads"} />
                </div>
                <Text margin="0" fontSize="0.9em">close <CloseIcon margin="0" onClick={() => close()} /> </Text>
            </Box>
            <Divider width="100%" height="1px" />
            {
                currentView === "downloads"
                    ? <DownloadView downloadableFiles={downloadableFiles} />
                    : <ShareView outFiles={outFiles} shareNewFile={shareNewFile} />
            }
        </Box>
    </>;
}


interface DownloadViewState {
    downloadableFiles: PublicSharedFile[]
}

const DownloadView: FunctionComponent<DownloadViewState> = ({ downloadableFiles }) => {
    return <Box height="50vh" margin="0 auto" direction="column">
        <Box display="flex" direction="row" justifyContent="space-between" width="500px">
            <Text fontSize="1.6em" fontWeight="600" color="#4a4a4a" lineHeight="2.67">Files shared with you</Text>
        </Box>
        <Box margin="0">
            <FilesList>
                {blinq(downloadableFiles).select(f => <FilesListItem key={f.fileName}>
                    <DocumentSvg margin="0 1em 0 0" width="30px" />
                    <Text margin="5px 0 0 0" color="#4f4f4f">{f.fileName}</Text>
                </FilesListItem>)}
            </FilesList>
        </Box>
    </Box>;
}
interface ShareViewProps {
    shareNewFile: () => void
    outFiles: SharedFile[]
}
const ShareView: FunctionComponent<ShareViewProps> = ({ outFiles, shareNewFile }) => {
    return <Box height="50vh" margin="0 auto" direction="column">
        <Box display="flex" direction="row" justifyContent="space-between" width="500px">
            <Text fontSize="1.6em" fontWeight="600" color="#4a4a4a" lineHeight="2.67">Your shared files</Text>
            <div style={{ display: 'flex' }}>
                <Text margin="3.8em 0 0 0" fontSize="0.8em" fontWeight="50">share new file</Text>
                <BtnAddLinksIcon margin="2.6em 0 0 0" onClick={() => shareNewFile()} />
            </div>
        </Box>
        <Box margin="0">
            <FilesList>
                {outFiles
                    ? blinq(outFiles).select(f => <FilesListItem key={f.relativePath}>
                        <DocumentSvg margin="0 1em 0 0" width="30px" />
                        <Text margin="5px 0 0 0" color="#4f4f4f">{f.relativePath}</Text>
                    </FilesListItem>)
                    : []}


            </FilesList>
        </Box>
    </Box>;
}

