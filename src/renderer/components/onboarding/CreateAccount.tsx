import React from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_with_text.svg";
import addIcon from "../../assets/svgs/p-share-add.svg";
import restoreIcon from "../../assets/svgs/p-share-re-use.svg";
import Box from "../ui-elements/Box";
import { SCard } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import { H3, Text } from "../ui-elements/Text";
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { PickedDispatchProps } from "../../system/PickedDispatchProps";

export interface CreateAccountStateProps {

}

export type CreateAccountDispatchProps = PickedDispatchProps<typeof OnboardingActions, "createAccount" | "restoreAccount">
type CreateAccountProps = CreateAccountStateProps & CreateAccountDispatchProps

export const CreateAccount: React.FunctionComponent<CreateAccountProps> =
    ({ createAccount, restoreAccount }) =>
        <>
            <Box width="100%" margin="4em 0 10% 0" align="center" >
                <AppLogo src={logo} width="180px" height="150" />
            </Box>
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}>


                <Container height="50vh">
                    <Box direction="column" align="center" width="100%">
                        <Box display="flex" direction="row" align="center" width="100%">
                            <SCard onClick={() => createAccount()}>
                                <img src={addIcon} height="80px" width="80px" />
                                <H3 align="center" color="white">Create Account</H3>
                                <Text color="white" align="center">Create a brand new account</Text>
                            </SCard>
                            <SCard onClick={() => restoreAccount()}>
                                <img src={restoreIcon} height="80px" width="80px" />
                                <H3 align="center" color="white">Restore Account</H3>
                                <Text color="white" align="center">You have a backed up mnemonic or file you would like to restore from</Text>
                            </SCard>
                        </Box>
                    </Box>
                </Container>


            </CSSTransitionGroup>
        </> 