import React, { FormEvent, FunctionComponent, useState } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton, BackButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import { H1, Text, H3 } from "../ui-elements/Text";
import PshareSecureFileSvg from "../../assets/svgs/p-share-secure-file.svg";
import { PickedDispatchProps } from "../../system/PickedDispatchProps";
import { OnboardingActions } from "../../../shared/actions/onboarding";



export interface SecureFilePasswordStateProps {

    error?: string
}

export type SecureFilePasswordDispatchProps = PickedDispatchProps<typeof OnboardingActions, "mnemonicRestoreFilePassphraseSubmitted" | "resetValidationForField" | "fieldValidated" | "restoreSync" | "secureFilePasswordCancelled">

type SecureFilePasswordProps = SecureFilePasswordDispatchProps & SecureFilePasswordStateProps


export const SecureFilePassword: FunctionComponent<SecureFilePasswordProps> = ({ secureFilePasswordCancelled, mnemonicRestoreFilePassphraseSubmitted, error,restoreSync }) => {
    const [passwordText, setPasswordText] = useState("")

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mnemonicRestoreFilePassphraseSubmitted(passwordText)
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
                <form onSubmit={handleSubmit}>
                    <Box direction="column" align="center" width="100%">
                        <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                            <BackButton onClick={() => secureFilePasswordCancelled()} margin="130px 0 0 -100px" />
                            <Card width="100%" align="center" minHeight="300px" padding="2em 4em 2em 2em">
                                <Box display="flex" direction="row" margin="0">
                                    <Box width="60px" margin="0">
                                        <img src={PshareSecureFileSvg} width="60px" height="60px" />
                                    </Box>
                                    <Box margin="1em 0 0 2em">
                                        <H3 margin="0 0 1em 0">Restore using Secure Restore File </H3>
                                        <Text fontSize="0.8em">Enter your secure file password</Text>
                                        <Input value={passwordText} name="password" onChange={e => setPasswordText(e.target.value)} placeholder="Password"
                                            type="password" margin="1em 0 1em 0" padding="0 1em 0 1em" autoFocus={true} />
                                        <Text fontSize="0.8em" margin="0">This is the password used to create the secure file</Text>
                                        {error ? <Text align="center" color="#e30429">{error}</Text> : <></>}
                                    </Box>
                                </Box>

                            </Card>
                        </Box>
                        <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
                            <ArrowButton label="Continue" type="submit" />

                        </Box>
                    </Box>
                </form>
            </Container>
        </CSSTransitionGroup>
    </>
}


