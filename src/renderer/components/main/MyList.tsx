import { FunctionComponent } from "react";
import React from "react";
import { BdapUser } from "../../../shared/reducers/bdap";

export interface MyListStateProps {
    users: BdapUser[]
}
export interface MyListDispatchProps {

}
export type MyListProps = MyListStateProps & MyListDispatchProps
export const MyList: FunctionComponent<MyListProps> = ({ users }: MyListProps) =>
    <div>
        {users.map(u => <div>{u.commonName}</div>)}
    </div>