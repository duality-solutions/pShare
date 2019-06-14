import React, { FunctionComponent, useState } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
// import { ValidationResult } from "../../../shared/system/validator/ValidationResult";
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { BackButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import PshareSecureFileSvg from "../../assets/svgs/p-share-secure-file.svg";
import { AppLogo } from '../ui-elements/Image';
// import Input from "../ui-elements/Input";
import { H1, Text, H3 } from "../ui-elements/Text";
import { Dropzone, DropzoneError } from "../ui-elements/Dropzone";
import { PickedDispatchProps } from "../../system/PickedDispatchProps";
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { FilePathInfo } from "../../../shared/types/FilePathInfo";


export interface RestoreWithMnemonicFileStateProps {
    // isValidating: boolean,
    // validationResult?: ValidationResult<string>
    error?: string
}

export type RestoreWithMnemonicFileDispatchProps = PickedDispatchProps<typeof OnboardingActions, "restoreWithMnemonicFileCancelled" | "secureFilePassword" | "mnemonicRestoreFilePathSubmitted">


type RestoreWithMnemonicFileProps = RestoreWithMnemonicFileDispatchProps & RestoreWithMnemonicFileStateProps



export const RestoreWithMnemonicFile: FunctionComponent<RestoreWithMnemonicFileProps> = ({ restoreWithMnemonicFileCancelled, secureFilePassword, mnemonicRestoreFilePathSubmitted, error: stateError }) => {
    const [error, setError] = useState<DropzoneError | undefined>(undefined)
    const filesSelectedHandler = (files: FilePathInfo[]) => {
        if (files.length !== 1) {
            setError({ title: "More that one file selected", message: "Please select only one file" })
            return
        }
        const file: FilePathInfo = files[0]
        if (file.size > 131072) { //128KiB
            setError({ title: "File is too large", message: "Please select a mnemonic recovery file" })
            return
        }
        mnemonicRestoreFilePathSubmitted(file.path)
        secureFilePassword()
    }
    return <>
        <Box width="100%" margin="2em 0 -1.5em 0" align="center">
            <AppLogo src={logo} width="100px" height="120px" />
        </Box>
        <CSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}>
            <H1 align="center" colored fontWeight="600">Restore Account</H1>
            <Container height="50vh" margin="10% 0 0 0">
                <form onSubmit={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    secureFilePassword()
                    return false;
                }}>
                    <Box direction="column" align="center" width="100%">
                        <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                            <BackButton onClick={() => restoreWithMnemonicFileCancelled()} margin="150px 0 0 -80px" />
                            <Card width="100%" align="center" minHeight="225px" padding="2em 4em 2em 2em">
                                <Box display="flex" direction="row" margin="0">
                                    <Box width="60px" margin="0">
                                        <img src={PshareSecureFileSvg} width="60px" height="60px" />
                                    </Box>
                                    <Box direction="column" width="500px" align="center" margin="0 auto 0 auto">
                                        <H3 margin="0 0 1em 0">Restore using Secure Restore File </H3>
                                        <Dropzone multiple={false} accept={".psh.json"} filesSelected={filesSelectedHandler} error={error}></Dropzone>
                                        {stateError ? <Text align="center" color="#e30429">{stateError}</Text> : <></>}
                                    </Box>
                                </Box>
                            </Card>
                        </Box>
                        {/* <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
                            <ArrowButton label="Continue" type="submit" />

                        </Box> */}

                    </Box>
                </form>
            </Container>
        </CSSTransitionGroup>
    </>
}
