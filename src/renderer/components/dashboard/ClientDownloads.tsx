import React, { FunctionComponent } from "react";
import { FileRequestDownloadState } from "../../../shared/reducers/clientDownloads";
import { entries } from "../../../shared/system/entries";
import Container from "../ui-elements/Container";
import { FilesList, FilesListItem, FilesListFile } from "../ui-elements/Dashboard";
import { OutboxIcon, UserListAvatar, ProgressSpinner } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";
import { Box } from "../ui-elements/Box";
import man from "../../assets/man.svg";
import { LinkDisplayName } from "./LinkDisplayName";
import { prettySize } from "../../../shared/system/prettySize";

export interface ClientDownloadsDispatchProps {

}
export interface ClientDownloadsStateProps {
    currentSessions: Record<string, FileRequestDownloadState>
}
export type ClientDownloadsProps = ClientDownloadsDispatchProps & ClientDownloadsStateProps
export const ClientDownloads: FunctionComponent<ClientDownloadsProps> = ({ currentSessions }) => <>
    <div style={{ width: "100%", display: 'block' }}>
        <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
            <Text color="#4a4a4a" fontSize="1.8em" fontWeight="600">
                <OutboxIcon width="40px" height="35px" margin="0 10px 0 0" />
                Downloads from you
            </Text>
            <div style={{
                border: 'solid 0.2px #d2d2d2',
                height: '0.2px',
                margin: '25px 0 10px 0',
                width: '100%'
            }} />
            <FilesList>
                {
                    (() => {
                        const sessionEntries = entries(currentSessions);
                        if (!sessionEntries.any()) {
                            return <p>Nobody is downloading data from you</p>
                        }
                        else {
                            return sessionEntries
                                .select(([key, downloadState]) => {
                                    return (
                                        <Box key={key} width="100%" margin="30px 0 0 0" >
                                            <div style={{ display: 'flex' }}>
                                                <UserListAvatar src={man} />
                                                <LinkDisplayName displayName={downloadState.requestorUserName} />
                                            </div>
                                            <FilesListItem >
                                                <FilesListFile>
                                                    <Text color="#4a4a4a" margin="0"> {downloadState.fileName}</Text>
                                                </FilesListFile>
                                                <div style={{
                                                    border: 'solid 0.2px #d2d2d2',
                                                    height: '20px',
                                                    margin: '0',
                                                    width: '1px'
                                                }} />
                                                <Text margin="0" color="#4a4a4a" fontSize="0.9em" ><strong>{prettySize(downloadState.size)}</strong></Text>
                                                <div style={{
                                                    border: 'solid 0.2px #d2d2d2',
                                                    height: '20px',
                                                    margin: '0',
                                                    width: '0.4px'
                                                }} />
                                                <Text color="#4a4a4a" margin="0" fontSize="0.8em">
                                                    <>{`${downloadState.progressPct}%`}</> <ProgressSpinner margin="0" height="25px" />
                                                </Text>
                                            </FilesListItem>
                                            <div style={{
                                                border: 'solid 0.4px #d2d2d2',
                                                height: '0.4px',
                                                margin: '20px 0 10px 0',
                                                width: '100%'
                                            }} />
                                        </Box>
                                    )
                                })
                        }
                    })()
                }

            </FilesList>
        </Container>
    </div>

</>


