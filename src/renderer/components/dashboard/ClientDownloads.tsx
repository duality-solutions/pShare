import React, { FunctionComponent } from "react";
import { FileRequestDownloadState } from "../../../shared/reducers/clientDownloads";
import { entries } from "../../../shared/system/entries";
import Container from "../ui-elements/Container";
import { H1 } from "../ui-elements/Text";
import { FilesList, FilesListItem, FilesListFile } from "../ui-elements/Dashboard";
import { DocumentSvg, OutboxIcon } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";

export interface ClientDownloadsDispatchProps {

}
export interface ClientDownloadsStateProps {
    currentSessions: Record<string, FileRequestDownloadState>
}
export type ClientDownloadsProps = ClientDownloadsDispatchProps & ClientDownloadsStateProps
export const ClientDownloads: FunctionComponent<ClientDownloadsProps> = ({ currentSessions }) => <>
    <div style={{ width: "100%", display: 'block' }}>
        <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
            <H1 color="#4a4a4a">
                <OutboxIcon width="50px" height="50px" margin="0" />
                Downloads from you
            </H1>
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
                                    return <FilesListItem key={key}>
                                        <FilesListFile>
                                            <DocumentSvg margin="0 1em 0 0" width="30px" />
                                            <Text margin="5px 0 0 0" color="#4f4f4f">{downloadState.requestorUserName} - {downloadState.fileName}</Text>
                                        </FilesListFile><div>
                                            <>{`${downloadState.status} ${downloadState.progressPct}%`}</>
                                        </div>
                                    </FilesListItem>
                                })
                        }
                    })()
                }

            </FilesList>
        </Container>
    </div>

</>