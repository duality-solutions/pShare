import * as React from "react";
import { Route, Switch } from 'react-router'
// import Counter from "../containers/Counter";
// import { Home } from "../components/Home";
import Sync from "../containers/Sync";
import { Main } from "../components/Main";
import SyncAgree from "../containers/SyncAgree";


export default
    <Switch>
        {/* <Route exact path="/counter" component={Counter} />
        <Route exact path="/sync" component={Sync} /> */}
        <Route exact path="/Sync" component={Sync} />
        <Route exact path="/SyncAgree" component={SyncAgree} />
        <Route exact path="/Main" component={Main} />
    </Switch>