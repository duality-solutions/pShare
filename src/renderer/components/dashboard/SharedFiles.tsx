import { FunctionComponent, useState } from "react";
import React from "react";
import man from "../../assets/man.svg";
import { Box } from "../ui-elements/Box";
import { LinkDisplayName } from "./LinkDisplayName";
import { UserListAvatar, CloseIcon, BtnAddLinksIcon, DocumentSvg, DeleteIcon, DownloadIcon, DoneIcon, ErrorIcon } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";
import Button, { SharedButton, DownloadButton, CustomButton } from "../ui-elements/Button";
import { Divider } from "../ui-elements/Divider";
import { FilesList, FilesListItem, FilesListFile, Hovered } from "../ui-elements/Dashboard";
import { SharedFile } from "../../../shared/types/SharedFile";
import { blinq } from "blinq";
import { FileRequest } from "../../../shared/actions/payloadTypes/FileRequest";
import { SharedFilesFetchState } from "../../../shared/types/SharedFilesFetchState";
import { DownloadableFile } from "../../../shared/types/DownloadableFile";
import { InlineSpinner } from "../ui-elements/LoadingSpinner";
import { prettySize } from "../../../shared/system/prettySize";
import CircularProgress from "../ui-elements/CircularProgress";
import BalanceIndicator from "../../containers/dashboard/BalanceIndicator";
import { DirectoryEntry } from "../../../shared/system/file/DirectoryEntry";
import { FileEntry } from "../../../shared/system/file/FileEntry";
import { NavigationCommand, BaseNavigationCommand } from "../../../shared/actions/fileNavigation";


export interface SharedFilesStateProps {
    outFilesView: (DirectoryEntry<SharedFile> | FileEntry<SharedFile>)[]
    downloadableFilesView: (DirectoryEntry<DownloadableFile> | FileEntry<DownloadableFile>)[]
    currentSharedFilesPath: string
    currentDownloadableFilesPath: string
    linkedUserCommonName?: string
    linkedUserName?: string
    downloadableFiles: DownloadableFile[]
    userName: string
    sharedFilesFetchState: SharedFilesFetchState
}
export interface SharedFilesDispatchProps {
    close: () => void
    shareNewFile: () => void
    requestFile: (req: FileRequest) => void
    removeSharedFile: (filePath: string) => void
    openDirectory: (navCommand: NavigationCommand) => void
    upDirectory: (navCommand: BaseNavigationCommand) => void
    goRoot: (navCommand: NavigationCommand) => void
}
export type SharedFilesProps = SharedFilesStateProps & SharedFilesDispatchProps
export const SharedFiles: FunctionComponent<SharedFilesProps> = ({ downloadableFilesView, currentSharedFilesPath, currentDownloadableFilesPath, openDirectory, upDirectory, goRoot, close, requestFile, removeSharedFile, shareNewFile, outFilesView, linkedUserName, userName, linkedUserCommonName, sharedFilesFetchState }) => {
    const [currentView, setCurrentView] = useState<"shared" | "downloads">("shared")
    const [promptModal, setPromptModal] = useState<true | false>(false)
    const [filePath, setFilePath] = useState<string | undefined>(undefined)

    return <>
        {promptModal && <DeletePrompt filePath={filePath || undefined} removeSharedFile={removeSharedFile} cancel={() => setPromptModal(false)} />}
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
                    ? <DownloadView
                        downloadableFilesView={downloadableFilesView}
                        currentDownloadableFilesPath={currentDownloadableFilesPath}
                        requestFile={requestFile}
                        ownerUserName={linkedUserName!}
                        userName={userName}
                        sharedFilesFetchState={sharedFilesFetchState}
                        openDirectory={openDirectory}
                        upDirectory={upDirectory}
                        goRoot={goRoot}

                    />
                    : <ShareView
                        outFilesView={outFilesView}
                        shareNewFile={shareNewFile}
                        toggleDeleteModal={() => setPromptModal(!promptModal)}
                        setFilePath={setFilePath}
                        openDirectory={openDirectory}
                        upDirectory={upDirectory}
                        goRoot={goRoot}
                        currentSharedFilesPath={currentSharedFilesPath}
                    />
            }
        </Box>
    </>;
}


interface DownloadViewState {
    downloadableFilesView: (DirectoryEntry<DownloadableFile> | FileEntry<DownloadableFile>)[]
    currentDownloadableFilesPath: string
    requestFile: (req: FileRequest) => void
    userName: string
    ownerUserName: string
    sharedFilesFetchState: SharedFilesFetchState
    openDirectory: (navCommand: NavigationCommand) => void
    upDirectory: (navCommand: BaseNavigationCommand) => void
    goRoot: (navCommand: NavigationCommand) => void

}

const DownloadView: FunctionComponent<DownloadViewState> = ({ openDirectory, upDirectory, downloadableFilesView, currentDownloadableFilesPath, requestFile, userName, ownerUserName, sharedFilesFetchState }) => {
    switch (sharedFilesFetchState) {
        case "success":
            return <Box height="50vh" margin="0 auto" direction="column">
                <Box display="flex" direction="row" justifyContent="space-between" width="500px">
                    <Text fontSize="1.6em" fontWeight="600" color="#4a4a4a" lineHeight="2.67">Files shared with you</Text>
                </Box>
                <Box margin="0">
                    <div style={{ fontWeight: "bold", border: "solid 1px #aaa", padding: "10px" }}>Current path: {currentDownloadableFilesPath.length > 0 ? "/" : ""}{currentDownloadableFilesPath}/</div>
                    <FilesList>
                        {
                            currentDownloadableFilesPath.length > 0
                                ?
                                <FilesListItem key={"[[[go_up]]]"} onClick={() => upDirectory({ type: "downloadableFiles" })}>
                                    ../
                            </FilesListItem>
                                :
                                <></>
                        }
                        {
                            downloadableFilesView
                                ?
                                blinq(downloadableFilesView)
                                    .select(entry => {
                                        if (entry.type === "file") {
                                            const fileEntry = (entry as FileEntry<DownloadableFile>)
                                            const f = fileEntry.fileInfo;
                                            return <FilesListItem key={f.file.fileName}>
                                                <FilesListFile>
                                                    <DocumentSvg margin="0 1em 0 0" width="30px" />
                                                    <Text margin="5px 0 0 0" color="#4f4f4f">{f.file.fileName}</Text>
                                                </FilesListFile>
                                                <div>
                                                    {(() => {
                                                        switch (f.state) {
                                                            case "downloading": //download progress bars
                                                                return <div style={{ display: 'flex' }}>
                                                                    <Text fontSize="0.6em" margin="8px 4px 0 0" color="#4a4a4a">
                                                                        downloading
                                                                </Text>
                                                                    <CircularProgress size={30} progress={f.progressPct} />
                                                                </div>;
                                                            case "ready":
                                                                return (<Hovered>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <Text fontSize="0.6em" margin="8px 0 0 0" color="#4a4a4a">{prettySize(f.file.size)}</Text>
                                                                        <DownloadIcon margin="0" onClick={() => requestFile({ ownerUserName, requestorUserName: userName, fileName: f.file.fileName })} />
                                                                    </div>
                                                                </Hovered>);
                                                            case "failed": // try again cancel buttons 
                                                                return <>
                                                                    <ErrorIcon />
                                                                </>;
                                                            case "downloaded":
                                                                return <DoneIcon margin="0" />;
                                                            case "starting":
                                                                return (<Text fontSize="0.6em" margin="8px 0 0 0" color="#4a4a4a">
                                                                    Starting
                                                            </Text>);
                                                            default:
                                                                return <></>;
                                                        }
                                                    })()}
                                                </div>
                                            </FilesListItem>;
                                        }
                                        if (entry.type === "directory") {
                                            const directoryEntry = (entry as DirectoryEntry<DownloadableFile>);
                                            return <FilesListItem key={directoryEntry.name} onClick={() => openDirectory({ type: "downloadableFiles", location: directoryEntry.name! })}>
                                                {directoryEntry.name}/
                                        </FilesListItem>
                                        }
                                        throw Error("unexpected entry type")

                                    })

                                : []
                        }

                    </FilesList>
                </Box>
            </Box>;
        case "failed":
            return <Box height="50vh" margin="0 auto" direction="column">
                <Box display="flex" direction="row" justifyContent="space-between" width="500px">
                    <Text fontSize="1.6em" fontWeight="600" color="#4a4a4a" lineHeight="2.67">User is offline</Text>
                </Box>
            </Box>
        case "downloading":
            return <InlineSpinner active={true} label="Fetching remote file list" />
        case "initial":
        default:
            return <></>

    }

}

const DeletePrompt: FunctionComponent<{
    cancel: () => void,
    removeSharedFile: (filePath: string) => void,
    filePath: string | undefined,
}> = ({ cancel, removeSharedFile, filePath }) => {
    return (
        <div style={{
            zIndex: 999,
            position: 'fixed',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)'
        }}>
            <Box background="#fafafa" margin="35vh auto 0 20vw" borderRadius="5px" padding="1em 0.5em" minWidth="200px">
                <Text fontSize="1em" fontWeight="400" margin="0 0 10px 0" color="#4a4a4a" align="center">
                    Are you sure you wanna delete <strong>{filePath ? filePath.split('/').pop() : ''}</strong> ?
            </Text>
                <Box display="flex" width="100%" margin="0" justifyContent="space-between">
                    <CustomButton background="palevioletred" color="white" width="49%" onClick={() => cancel()}>Cancel</CustomButton>
                    <Button width="49%" primary onClick={() => {
                        if (filePath) {
                            removeSharedFile(filePath);
                            cancel()
                        }
                    }}> Proceed</Button>
                </Box>
            </Box>
        </div>

    )
}

interface ShareViewProps {
    shareNewFile: () => void
    outFilesView: (DirectoryEntry<SharedFile> | FileEntry<SharedFile>)[]
    toggleDeleteModal: (filePath: string) => void,
    setFilePath: (filePath: string) => void
    openDirectory: (navCommand: NavigationCommand) => void
    upDirectory: (navCommand: BaseNavigationCommand) => void
    goRoot: (navCommand: NavigationCommand) => void
    currentSharedFilesPath: string

}
const ShareView: FunctionComponent<ShareViewProps> = ({ currentSharedFilesPath, outFilesView, shareNewFile, toggleDeleteModal, setFilePath, openDirectory, upDirectory }) => {
    return (
        <div style={{ width: "100%", display: 'block', position: "relative" }}>
            <BalanceIndicator hideLinkWhenMinimized={true} />
            <Box height="50vh" margin="0 auto" direction="column">
                <Box display="flex" direction="row" justifyContent="space-between" width="500px">
                    <Text fontSize="1.6em" fontWeight="600" color="#4a4a4a" lineHeight="2.67">Your shared files</Text>
                    <div style={{ display: 'flex' }}>
                        <Text margin="3.8em 0 0 0" fontSize="0.8em" fontWeight="50">share new file</Text>
                        <BtnAddLinksIcon margin="2.6em 0 0 0" onClick={() => shareNewFile()} />
                    </div>
                </Box>
                <Box margin="0">
                    <div style={{ fontWeight: "bold", border: "solid 1px #aaa", padding: "10px" }}>Current path: {currentSharedFilesPath.length > 0 ? "/" : ""}{currentSharedFilesPath}/</div>
                    <FilesList>
                        {
                            currentSharedFilesPath.length > 0
                                ?
                                <FilesListItem key={"[[[go_up]]]"} onClick={() => upDirectory({ type: "sharedFiles" })}>
                                    ../
                            </FilesListItem>
                                :
                                <></>
                        }
                        {outFilesView
                            ? blinq(outFilesView)
                                .select(entry => {
                                    if (entry.type === "file") {
                                        const fileEntry = (entry as FileEntry<SharedFile>);
                                        const f = fileEntry.fileInfo;
                                        return <FilesListItem key={f.relativePath}>
                                            <FilesListFile>
                                                <DocumentSvg margin="0 1em 0 0" width="30px" />
                                                <Text margin="5px 0 0 0" color="#4f4f4f">{f.relativePath}</Text>
                                            </FilesListFile>
                                            <Hovered>
                                                <DeleteIcon onClick={() => {
                                                    toggleDeleteModal(f.path);
                                                    setFilePath(f.path);
                                                }} width="35px" height="20px" margin="5px 10px" />
                                            </Hovered>
                                        </FilesListItem>;
                                    }
                                    if (entry.type === "directory") {
                                        const directoryEntry = (entry as DirectoryEntry<SharedFile>);
                                        return <FilesListItem key={directoryEntry.name} onClick={() => openDirectory({ type: "sharedFiles", location: directoryEntry.name! })}>
                                            {directoryEntry.name}/
                                        </FilesListItem>
                                    }
                                    throw Error("unexpected entry type")

                                })
                            : []}
                    </FilesList>
                </Box>
            </Box>
        </div>
    )
}

