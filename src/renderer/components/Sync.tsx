import * as React from 'react'
import Container from './ui-elements/Container';
import { H1, Text } from './ui-elements/Text';
import ProgressBar from './ui-elements/ProgressBar';
import Box from './ui-elements/Box';
import { AppLogo }from './ui-elements/Image';
import logo from "../assets/logowt.svg"


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
      <Box width="96%">
      <AppLogo src={logo} width="100px" height="120px" />
      </Box>
      <Container height="50vh">
      <Box direction="column" >
      <H1 align="center" colored>Sync Progress</H1>
      <Box direction="row" width="100%">
      {console.log('isComplete: ',isComplete, 'syncStarted',syncStarted)}
      { 
        syncStarted ?
        !isComplete ?
        <ProgressBar level={progressPercent} status="Syncing blocks" /> :
        <Text>Sync is complete</Text> :
        <Text>Waiting for sync to start</Text>
      }  
      </Box>
      </Box>
      </Container>
    </>