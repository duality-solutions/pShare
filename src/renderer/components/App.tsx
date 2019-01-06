import * as React from 'react'
import routes from '../routes';
import { NavLink } from 'react-router-dom'

export const App: React.FunctionComponent =
    () =>
        <div>
            <h4>My app</h4>
            <NavLink to="/">home</NavLink> <NavLink id="counter-navlink" to="/counter">counter</NavLink>
            {routes}
        </div>

