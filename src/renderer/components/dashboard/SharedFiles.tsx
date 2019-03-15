import { FunctionComponent } from "react";
import React from "react";
import man from "../../assets/man.svg";
import { Box } from "../ui-elements/Box";
import { LinkDisplayName } from "./LinkDisplayName";
import { UserListAvatar, CloseIcon, BtnAddLinksIcon, DocumentSvg } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";
import { SharedButton, DownloadButton } from "../ui-elements/Button";
import { Divider } from "../ui-elements/Divider";
import { FilesList, FilesListItem } from "../ui-elements/Dashboard";


export const SharedFiles: FunctionComponent = () =>
    <>
            <Box background="#fafafa" minHeight="90vh" width="100%" margin="18px"
                border="solid 1px #e9e9e9" borderRadius="23px" padding="1.5em 1em">
                <Box display="flex" direction="row" width="100%" justifyContent="space-between" margin="0 0 1em 0">
                    <div style={{ display: 'flex'}}><UserListAvatar src={man} />
                        <LinkDisplayName displayName="Walker Adranz"/>
                    </div>
                    <div style={{ display: 'flex', }}> 
                        <SharedButton onClick={()=>{}} />
                        <DownloadButton onClick={()=>{}} white={true}/>
                    </div>
                    <Text margin="0" fontSize="0.9em">close <CloseIcon margin="0"/> </Text>
                </Box>
                <Divider width="100%" height="1px" />
                <Box height="50vh" margin="0 auto" direction="column" >
                    <Box display="flex" direction="row" justifyContent="space-between" width="500px">
                    <Text fontSize="1.6em" fontWeight="600" color="#4a4a4a" lineHeight="2.67">Your shared files</Text>
                    <div style={{ display: 'flex'}}>
                    <Text margin="3.8em 0 0 0" fontSize="0.8em" fontWeight="50">share new file</Text>
                    <BtnAddLinksIcon margin="2.6em 0 0 0"/>
                    </div>
                    </Box>
                    <Box margin="0" >
                        <FilesList>
                            <FilesListItem>
                                <DocumentSvg margin="0 1em 0 0" width="30px"  />
                                <Text margin="5px 0 0 0" color="#4f4f4f">p-share app icons_p-share-account-16</Text>
                            </FilesListItem>
                            <FilesListItem>
                                <DocumentSvg margin="0 1em 0 0" width="30px"  />
                                <Text margin="5px 0 0 0" color="#4f4f4f">p-share app icons_p-share-account-16</Text>
                            </FilesListItem>
                        </FilesList>
                    </Box>
                </Box>
            </Box>
    </>




