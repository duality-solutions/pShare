import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton } from "../ui-elements/Button";
import Card from '../ui-elements/Card';
import Container from '../ui-elements/Container';
import { AppLogo } from '../ui-elements/Image';
import { H1, Text } from '../ui-elements/Text';
import { PickedDispatchProps } from "../../system/PickedDispatchProps";
import { UserActions } from '../../../shared/actions/user';

export interface SyncAgreeStateProps {

}
export interface SyncAgreeDispatchProps {

  userAgreeSync: () => void

}
export type MnemonicPageDispatchProps = PickedDispatchProps<typeof UserActions, "userAgreeSync">

type SyncAgreeProps = SyncAgreeStateProps & SyncAgreeDispatchProps

export const SyncAgree: React.FunctionComponent<SyncAgreeProps> =
  ({ userAgreeSync }) =>
    <>
      <CSSTransitionGroup
        transitionName="fadeContainerIn"
        transitionAppear={true}
        transitionAppearTimeout={2000}
        transitionEnter={false}
        transitionLeave={false}>

        <Box width="100%" margin="2em 0 -1.5em 0" align="center">
          <AppLogo src={logo} width="100px" height="120px" />
        </Box>
      </CSSTransitionGroup>

      <CSSTransitionGroup
        transitionName="fadeContainerIn"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={true}
        transitionLeaveTimeout={500}>

        <H1 align="center" colored fontWeight="600">Welcome</H1>
        <Container height="50vh">
          <Box direction="column" width="100%" align="center">
            <Box direction="column" width="50%" align="right" margin="0 auto 0 auto">
              <Card width="100%">
                <Text>
                  Before we begin, we need to sync a whole bunch of data that you’ll
                  need to be able to communicate with other pShare users.
            </Text>
                <Text>
                  This syncing process can take a while; so grab yourself a cup of coffee, sit back and relax.
            </Text>
                <Text>
                  See you shortly.
            </Text>
              </Card>
              <ArrowButton onClick={() => userAgreeSync()} label="Proceed" />
            </Box>
          </Box>

        </Container>
      </CSSTransitionGroup>
    </>
