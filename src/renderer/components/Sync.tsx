import * as React from 'react'

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
      <div>
        <h2>Sync progress</h2>
        {
          syncStarted ?
            !isComplete ?
              <div>pct: {progressPercent}%</div> :
              <>sync is complete</> :
            <>waiting for sync to start</>}
      </div>
    </>