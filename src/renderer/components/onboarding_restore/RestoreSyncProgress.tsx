import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from '../ui-elements/Box';
import Container from '../ui-elements/Container';
import { AppLogo } from '../ui-elements/Image';
import ProgressBar from '../ui-elements/ProgressBar';
import { H1 } from '../ui-elements/Text';
import LoadingSpinner from '../ui-elements/LoadingSpinner';


export interface RestoreSyncProgressStateProps {
  restoreSyncProgressStarted: boolean
  progressPercent: number
  isComplete: boolean
}
export interface RestoreSyncProgressDispatchProps {

}
type RestoreSyncProgressProps = RestoreSyncProgressStateProps & RestoreSyncProgressDispatchProps

export const RestoreSyncProgress: React.FunctionComponent<RestoreSyncProgressProps> =
  ({ progressPercent, isComplete, restoreSyncProgressStarted }) =>
    <>
      <Box width="100%" margin="2em 0 -1.5em 0" align="center">
        <AppLogo src={logo} width="100px" height="120px" />
      </Box>

      <CSSTransitionGroup
        transitionName="fadeContainerIn"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={true}
        transitionLeaveTimeout={500}>

        <H1 align="center" colored fontWeight="600">Restore Account</H1>

        <Container height="60vh" padding="5em 0 0 0">
          <Box direction="column" width="100%" align="center">
            <Box direction="row" width="100%" align="center" >
              {/* {
              RestoreSyncProgressStarted ?
              !isComplete ?
              <ProgressBar level={progressPercent} status="RestoreSyncProgressing blocks" /> :
              <Text>RestoreSyncProgress is complete</Text> :
              <Text align="center">Waiting for RestoreSyncProgress to start...</Text>
            }   */}
              <LoadingSpinner active={!restoreSyncProgressStarted} />
              {
                restoreSyncProgressStarted
                  ? <ProgressBar level={progressPercent} status="Restoring account" />
                  : <></>
              }
            </Box>
          </Box>
        </Container>

      </CSSTransitionGroup>
    </> 