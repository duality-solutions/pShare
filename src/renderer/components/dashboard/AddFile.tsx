import { FunctionComponent } from "react";
import React from "react";
import { Box } from "../ui-elements/Box";
import { CloseIcon, AddLinksIcon } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";
import Container from "../ui-elements/Container";
import { Card } from "../ui-elements/Card";
import Button from "../ui-elements/Button";

export interface FilePathInfo {
    path: string
    type: string
    size: number
}

export interface AddFileStateProps {

}

export interface AddFilesDispatchProps {

}

export type AddFileProps = AddFileStateProps & AddFilesDispatchProps

export const AddFile: FunctionComponent<AddFileProps> = ({ }) =>
    <>
            <Box background="#fafafa" minHeight="90vh" width="100%" margin="18px"
                border="solid 1px #e9e9e9" borderRadius="23px" padding="1.5em 1em">
                <Box display="flex" direction="row" width="100%" justifyContent="space-between" margin="0 0 1em 0">
                <Box margin="0" padding="10px" borderRadius="11px" height="56px" background="#efefef"  width="200px">
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Text margin="10px 0 0 0" align="center" fontSize="0.8em" fontWeight="600">Sending file to : </Text>
                <Text margin="10px 0 0 0" align="center" fontSize="0.8em">&nbsp;Gail&nbsp;</Text>
                <Text margin="10px 0 0 0" align="center" fontSize="0.8em" fontWeight="600">Allan</Text>
                </div>
                </Box>
                <Text margin="0" fontSize="0.9em">close <CloseIcon margin="0"/> </Text>
                </Box>
                <Container height="50vh" margin="10% 0 0 0">
                <Box direction="column" align="center" width="100%">
                    <Box direction="column" width="500px" align="center" margin="0 auto 0 auto">
                        <Text margin="0" color="#4a4a4a" fontSize="1.4em" fontWeight="600">
                        <AddLinksIcon width="40px" height="30px" margin="0" /> Add file</Text>
                        <Card 
                                 background="white" border="dashed 2px #b0b0b0" minHeight="266px" padding="75px 0"
                                 onDragOver={e => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = "move";
                                }}
                                onDrop={e => {
                                    e.preventDefault();
                                    console.log(e.dataTransfer.files)
                                    // filesSelected([...e.dataTransfer.files].map(f => ({ path: f.path, type: f.type, size: f.size })))
                                }}
                        >
                        <Text fontSize="18px" fontWeight="bold" color="#9b9b9b" margin="0" align="center"> Drag file here </Text>
                        <Text align="center" margin="20px 0">or</Text>
                        <input
                            type="file"
                            id="fileElem"
                            multiple
                            accept="*/*"
                            onChange={e => {
                                e.preventDefault();
                                console.log(e.currentTarget.files)
                                // e.currentTarget.files && filesSelected([...e.currentTarget.files].map(f => ({ path: f.path, type: f.type, size: f.size })))
                            }}
                            style={({ display: "none" })} />
                        <Button color="#0055c4" width="175px" >
                        <label
                            style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }}
                            className="button"
                            htmlFor="fileElem">
                            Select file
                        </label>
                        </Button>
                        </Card>
                    </Box>
                </Box>
                <Text align="center" fontSize="0.8em" margin="5em" color="#4a4a4a"> File size limit: 3gb</Text>
                </Container>
            </Box>
    </>




