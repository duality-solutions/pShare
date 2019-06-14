import React, { Component, FormEvent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import { H1, H3, Text } from "../ui-elements/Text";
import { PickedDispatchProps } from "../../system/PickedDispatchProps";
import { OnboardingActions } from "../../../shared/actions/onboarding";

export interface MnemonicWarningStateProps {
}

export type MnemonicWarningDispatchProps = PickedDispatchProps<typeof OnboardingActions, "mnemonicWarningAccepted">

type MnemonicWarningProps = MnemonicWarningDispatchProps & MnemonicWarningStateProps

interface MnemonicWarningComponentState {
}

export class MnemonicWarning extends Component<MnemonicWarningProps, MnemonicWarningComponentState>{
    constructor(props: MnemonicWarningProps) {
        super(props)
    }
    handleSubmit = (e: FormEvent) => {
        //if we don't prevent form submission, causes a browser reload
        e.preventDefault()
        console.log('go to mnemonic')
        this.props.mnemonicWarningAccepted()
    }

    render() {
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
                <H1 align="center" colored fontWeight="600">Create Account</H1>
                <Container height="50vh" margin="10% 0 0 0">
                    <form onSubmit={this.handleSubmit} >
                        <Box direction="column" align="center" width="100%">
                            {/* <BackArrowButton onClick={this.props.backToCreateAccount} /> */}

                            <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                                <Card width="100%" align="center" minHeight="225px" padding="2em 8em 2em 8em" border="solid 1px #e30429">
                                    <H3 color="#e30429">Mnemonic Warning !</H3>
                                    <Text>Please ensure that you are in a private location and no one can eavesdrop or see your screen.</Text>
                                    <Text>By clicking Continue, you will be shown your new wallet mnemonic, which if comprised will
                                            grant anyone access to your account.
                                    </Text>
                                    <Text>Write it down and keep it safe.</Text>
                                </Card>
                            </Box>
                            <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
                                <ArrowButton focus label="Continue" type="submit" />
                            </Box>
                        </Box>
                    </form>
                </Container>
            </CSSTransitionGroup>
        </>
    }
}
