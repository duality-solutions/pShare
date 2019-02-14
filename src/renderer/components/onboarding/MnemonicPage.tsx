import React, { FormEvent, FunctionComponent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import PsharePassphraseSvg from "../../assets/svgs/p-share-pass-phrase.svg";
import PshareSafeSvg from "../../assets/svgs/p-share-safe.svg";
import PshareSecureFileSvg from "../../assets/svgs/p-share-secure-file.svg";
import Box from "../ui-elements/Box";
import { ArrowButton, LightButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { Divider } from "../ui-elements/Divider";
import { AppLogo } from '../ui-elements/Image';
import LoadingSpinner from "../ui-elements/LoadingSpinner";
import { H1, H3, Text } from "../ui-elements/Text";

export interface MnemonicPageStateProps {
    mnemonic?: string
}

export interface MnemonicPageDispatchProps {
    mnemonicSecured: () => void
    mnemonicFileCreation: () => void
}

type MnemonicPageProps = MnemonicPageDispatchProps & MnemonicPageStateProps

export const MnemonicPage: FunctionComponent<MnemonicPageProps> = props => {

    const handleSubmit = (e: FormEvent) => {
        //if we don't prevent form submission, causes a browser reload
        e.preventDefault()
        props.mnemonicSecured()
    }
    const handleFileCreation = (e: FormEvent) => {
        e.preventDefault()
        props.mnemonicFileCreation()
        console.log('asfd')
    }

    return <>
        <Box width="100%" margin="2em 0 -1.5em 0" align="center">
            <AppLogo src={logo} width="100px" height="120px" />
        </Box>
        <CSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
            <H1 align="center" colored fontWeight="600">Create Account</H1>
            <Container height="50vh" margin="5% 0 0 0">
                <form onSubmit={handleSubmit}>
                    <Box direction="column" align="center" width="100%">
                        <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                            <Card width="100%" align="center" minHeight="225px" padding="2em 4em 2em 4em">
                                <H3>Your Mnemonic Pass Phrase</H3>
                                <Card width="100%" align="center" padding="1em" border="solid 1px grey" background="#fafafa">
                                    <Text color="grey" align="center" margin="0">{props.mnemonic}</Text>
                                </Card>
                                <Box display="flex" direction="row">
                                <Box width="50%" margin="0 1em 0 0">
                                    <Box display="flex" width="100%" margin="2em 0 0 0">
                                        <img src={PsharePassphraseSvg} width="80px" height="80px" />
                                        <span style={{ color: "#2e77d0", lineHeight: "1.2em", fontSize: "300%" }}>&#8594;</span>
                                        <img src={PshareSafeSvg} width="80px" height="80px" />
                                    </Box>
                                    <Text align="center">Write or print this phrase and </Text>
                                    <Text margin="0" align="center">keep it somewhere safe.</Text>
                                </Box>
                                <Box width="14px" direction="column" alignContents="center">
                                <Divider />
                                <Text margin="0">or</Text>
                                <Divider />
                                </Box>
                                <Box width="30%" margin="0 0 0 3em">
                                    <Box display="flex" width="100%" margin="2em 0 0 2em">
                                        <img src={PshareSecureFileSvg} width="80px" height="80px" style={{color:"blue"}} />
                                    </Box>
                                    <LightButton onClick={handleFileCreation}>Create a secure file</LightButton>
                                </Box>
                                </Box>
                            </Card>
                        </Box>
                        <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
                            <ArrowButton label="Continue" type="submit" />
                        </Box>
                    </Box>
                </form>
                <LoadingSpinner active={typeof props.mnemonic === 'undefined'} label="Generating your mnemonic passphrase" size={50} opaque />
            </Container>
        </CSSTransitionGroup>
    </>;
}
