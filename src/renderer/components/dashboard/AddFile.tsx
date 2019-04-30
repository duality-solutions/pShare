import { FunctionComponent, useState } from "react";
import React from "react";
import { Box } from "../ui-elements/Box";
import { CloseIcon, AddLinksIcon } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";
import Container from "../ui-elements/Container";
import { Card } from "../ui-elements/Card";
import Button from "../ui-elements/Button";
import { FilePathInfo } from "../../../shared/types/FilePathInfo";
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
    const [error, setError] = useState(false)
    const userNameParts = linkedUserCommonName.split(' ')
    const lastName = (userNameParts.length > 1) ? userNameParts[userNameParts.length - 1] : ""
    const firstName = userNameParts.length > 1 ? userNameParts.slice(0, -1).join(' ') : userNameParts[0]
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
                        <Card background="white" border={error ? "dashed 2px #ea4964" : "dashed 2px #b0b0b0"} minHeight="266px" padding="75px 0" onDragOver={e => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                        }} onDrop={e => {
                            e.preventDefault();
                            const files = [...e.dataTransfer.files];
                            if (files.some(f => f.size > maximumFileSize)) {
                                setError(true)
                                return
                            }
                            setError(false)
                            //console.log(e.dataTransfer.files);
                            filesSelected(files.map(f => ({ path: f.path, type: f.type, size: f.size })))
                        }}>
                            {error ?
                                <>
                                    <Text fontSize="18px" fontWeight="bold" color="#ea4964" margin="0" align="center">File too large!</Text>
                                    <Text align="center" margin="20px 0" fontSize="0.8em">please select or drag a file that is no larger than 3gb</Text>
                                </>
                                :
                                <>
                                    <Text fontSize="18px" fontWeight="bold" color="#9b9b9b" margin="0" align="center">Drag file here</Text>
                                    <Text align="center" margin="20px 0" fontSize="0.8em">or</Text>
                                </>}
                            <input type="file" id="fileElem" multiple accept="*/*" onChange={e => {
                                e.preventDefault();
                                if (!e.currentTarget.files) {
                                    return
                                }

                                const files = [...e.currentTarget.files];
                                if (files.some(f => f.size > maximumFileSize)) {
                                    setError(true)
                                    return
                                }
                                setError(false)
                                filesSelected(files.map(f => ({ path: f.path, type: f.type, size: f.size })))
                            }} style={({ display: "none" })} />
                            <Button color="#0055c4" width="175px">
                                <label style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }} className="button" htmlFor="fileElem">
                                    Select file
                                    </label>
                            </Button>
                        </Card>
                    </Box>
                </Box>
                <Text align="center" fontSize="0.8em" margin="5em" color="#4a4a4a"> File size limit: 3gb</Text>
            </Container>
        </Box>
    </>;
}

// export class AddFile extends Component<AddFileProps, AddFileComponentProps> {
//     constructor(props: AddFileComponentProps){
//         super(props)
//         this.state = {
//             error: false
//         }
//     }
//     render() {
//         const error = this.state.error

//         return(
//             <>
//                 <Box background="#fafafa" minHeight="90vh" width="100%" margin="18px"
//                     border="solid 1px #e9e9e9" borderRadius="23px" padding="1.5em 1em">
//                     <Box display="flex" direction="row" width="100%" justifyContent="space-between" margin="0 0 1em 0">
//                     <Box margin="0" padding="10px" borderRadius="11px" height="56px" background="#efefef"  width="200px">
//                     <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
//                     <Text margin="10px 0 0 0" align="center" fontSize="0.8em" fontWeight="600">Sending file to : </Text>
//                     <Text margin="10px 0 0 0" align="center" fontSize="0.8em">&nbsp;Gail&nbsp;</Text>
//                     <Text margin="10px 0 0 0" align="center" fontSize="0.8em" fontWeight="600">Allan</Text>
//                     </div>
//                     </Box>
//                     <Text margin="0" fontSize="0.9em">close <CloseIcon margin="0"/> </Text>
//                     </Box>
//                     <Container height="50vh" margin="10% 0 0 0">
//                     <Box direction="column" align="center" width="100%">
//                         <Box direction="column" width="500px" align="center" margin="0 auto 0 auto">
//                             <Text margin="0" color="#4a4a4a" fontSize="1.4em" fontWeight="600">
//                             <AddLinksIcon width="40px" height="30px" margin="0" /> Add file</Text>
//                             <Card 
//                                      background="white" border={error ? "dashed 2px #ea4964" : "dashed 2px #b0b0b0"} minHeight="266px" padding="75px 0"
//                                      onDragOver={e => {
//                                         e.preventDefault();
//                                         e.dataTransfer.dropEffect = "move";
//                                     }}
//                                     onDrop={e => {
//                                         e.preventDefault();
//                                         console.log(e.dataTransfer.files)
//                                         // filesSelected([...e.dataTransfer.files].map(f => ({ path: f.path, type: f.type, size: f.size })))
//                                     }}
//                             >
//                             { error ? 
//                                     <>
//                                         <Text fontSize="18px" fontWeight="bold" color="#ea4964" margin="0" align="center">File too large!</Text>
//                                         <Text align="center" margin="20px 0" fontSize="0.8em">please select or drag a file that is no larger than 3gb</Text>                                                            
//                                     </>
//                                     : 
//                                     <>
//                                         <Text fontSize="18px" fontWeight="bold" color="#9b9b9b" margin="0" align="center">Drag file here</Text>
//                                         <Text align="center" margin="20px 0" fontSize="0.8em">or</Text>                        
//                                     </>
//                                     }  
//                             <input
//                                 type="file"
//                                 id="fileElem"
//                                 multiple
//                                 accept="*/*"
//                                 onChange={e => {
//                                     e.preventDefault();
//                                     console.log(e.currentTarget.files)
//                                     // e.currentTarget.files && filesSelected([...e.currentTarget.files].map(f => ({ path: f.path, type: f.type, size: f.size })))
//                                 }}
//                                 style={({ display: "none" })} />
//                             <Button color="#0055c4" width="175px" >
//                             <label
//                                 style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }}
//                                 className="button"
//                                 htmlFor="fileElem">
//                                 Select file
//                             </label>
//                             </Button>
//                             </Card>
//                         </Box>
//                     </Box>
//                     <Text align="center" fontSize="0.8em" margin="5em" color="#4a4a4a"> File size limit: 3gb</Text>
//                     </Container>
//                 </Box>
//         </>
//     )}
// }