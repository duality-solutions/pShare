import * as React from 'react'
import Container from './ui-elements/Container';
import { H2, Text } from './ui-elements/Text';
import ProgressBar from './ui-elements/ProgressBar';
import Box from './ui-elements/Box';
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
      <Container>
      <Box direction="column" >
      <H2 align="center">Sync Progress</H2>
      <Box direction="row" width="100%">
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