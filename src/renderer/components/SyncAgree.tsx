import * as React from 'react'

export interface SyncAgreeStateProps {

}
export interface SyncAgreeDispatchProps {

  userAgreeSync: () => void

}
type SyncAgreeProps = SyncAgreeStateProps & SyncAgreeDispatchProps

export const SyncAgree: React.FunctionComponent<SyncAgreeProps> =
  ({ userAgreeSync }) =>
    <>
      <div>
        <h2>Sync agreement</h2>
        <button onClick={() => userAgreeSync()}>Agree to sync?</button>
      </div>
    </>