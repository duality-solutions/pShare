import * as React from "react";
import { Route, Switch } from 'react-router'
import Counter from "../containers/Counter";
import { Home } from "../components/Home";


export default
    <Switch>
        <Route exact path="/counter" component={Counter} />
        <Route path="/" component={Home} />
    </Switch>