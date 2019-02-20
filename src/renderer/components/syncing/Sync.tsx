import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from '../ui-elements/Box';
import Container from '../ui-elements/Container';
import { AppLogo } from '../ui-elements/Image';
import ProgressBar from '../ui-elements/ProgressBar';
import { H1, Text } from '../ui-elements/Text';


export interface SyncStateProps {
  syncStarted: boolean
  progressPercent: number
  isComplete: boolean
}
export interface SyncDispatchProps {

}
type SyncProps = SyncStateProps & SyncDispatchProps

export const Sync: React.FunctionComponent<SyncProps> =
  ({ progressPercent, isComplete, syncStarted }) =>
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

        <H1 align="center" colored>Syncing</H1>
        <Container height="60vh">
          <Box direction="column" width="100%" align="center">
            <Box direction="row" width="100%" align="center">
            { 
              syncStarted ?
              !isComplete ?
              <ProgressBar level={progressPercent} status="Syncing blocks" /> :
              <Text>Sync is complete</Text> :
              <Text align="center">Waiting for sync to start...</Text>
            }  
            </Box>
          </Box>
        </Container>
        
      </CSSTransitionGroup>
    </> 