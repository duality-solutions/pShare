import { FunctionComponent, useState } from "react";
import React from "react";
import { Box } from "../ui-elements/Box";
import { CloseIcon } from "../ui-elements/Image";
import { Text } from "../ui-elements/Text";
import Container from "../ui-elements/Container";
import { FilePathInfo } from "../../../shared/types/FilePathInfo";
import { Dropzone, DropzoneError } from "../ui-elements/Dropzone";
import Button from "../ui-elements/Button";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import { RequestStatus } from "../../../main/sagas/bulkImportSaga";



export interface BulkImportStateProps {
    data: string,
    fqdnData: RequestStatus[]
}

export interface BulkImportsDispatchProps {
    push: (pathname:string) => void,
    previewBulkImport: (filepath: FilePathInfo) => void
    beginBulkImport: (data: string) => void
}

export type BulkImportProps = BulkImportStateProps & BulkImportsDispatchProps

export const BulkImport: FunctionComponent<BulkImportProps> = ({ data, push, previewBulkImport, beginBulkImport, fqdnData }) => {
    // react hooks FTW!!!!
    const [
        error,
        // setError
    ] = useState<DropzoneError | undefined>(undefined)

    const [
        status, setStatus
    ] = useState<string>('dropzone') // default dropzone;


    // currently select only one file
    const filesSelectedHandler = (files: FilePathInfo[]) => {
        if(error) {
            return;
        }
        setStatus('preview');
        const file = files[0];
        previewBulkImport(file)
    }

    const renderBody = (status: string, fqdnData: RequestStatus[]) => {
        switch(status) {
            case "dropzone": 
                return (<>
                <Box display="flex" direction="row" width="100%" justifyContent="space-between" margin="0 0 1em 0">
                    <div />
                    <Text margin="0" fontSize="0.9em">close <CloseIcon margin="0" onClick={() => push("/Dashboard/AddLinks")} /> </Text>
                </Box>
                <Container height="50vh" margin="10% 0 0 0">
                    <Box direction="column" align="center" width="100%">
                        <Box direction="column" width="500px" align="center" margin="0 auto 0 auto">
                            <Text margin="0" color="#4a4a4a" fontSize="1.4em" fontWeight="600">
                                Bulk Import FQDN file
                            </Text>
                            <Dropzone error={error} filesSelected={filesSelectedHandler} ></Dropzone>
                        </Box>
                    </Box>
                </Container>
                </>);
            case "preview": 
                return (<>
                <Container height="50vh" margin="10% 0 0 0">
                    <Box direction="column" align="center" width="100%">
                        <Box direction="column" width="500px" align="center" margin="0 auto 0 auto">
                            <Text margin="0" color="#4a4a4a" fontSize="1.4em" fontWeight="600">
                                Preview
                            </Text>
                            <Text style={{ whiteSpace:'pre-wrap'}}>
                                {data}
                            </Text>
                            <Box display="flex" direction="row" width="100%" justifyContent="flex-start" margin="1em 0 0 0">
                            <Button onClick={() => setStatus('dropzone')} width="100px" margin="0 1em 0 0">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                    beginBulkImport(data);
                                    setStatus('result')
                                }} primary width="100px">
                                Send Link Requests
                            </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>                
                </>); 
            case "result":
                return (<>
                <Container height="50vh" margin="10% 0 0 0">
                <Box direction="column" align="center" width="100%">
                <Box direction="column" width="500px" align="center" margin="0 auto 0 auto">
                    <Text margin="0" color="#4a4a4a" fontSize="1.4em" fontWeight="900">
                        Bulk Import Result
                    </Text>
                    <UserList>
                        <UserListItem>
                            <div>FQDN</div>
                            <div>Status</div>
                        </UserListItem>
                    {fqdnData.map(item => 
                        <UserListItem>
                            <div>{item.link}</div>
                            <div>{item.status}</div>
                        </UserListItem>
                    )}
                    </UserList>
                    <Button primary onClick={() => push('/Dashboard/MyLinks')} margin="1em 0 0 0">
                        Go Back to MyLinks...
                    </Button>
                </Box>
                </Box>
                </Container>
                </>);
            default: return;
        }
    } 
    
     return <div style={{ width: "100%", display: 'block', position: "relative" }}>
        <Box background="#fafafa" minHeight="90vh" width="auto" margin="18px" border="solid 1px #e9e9e9" borderRadius="23px" padding="1.5em 1em">
            {renderBody(status, fqdnData)}
        </Box>
    </div>;
}


