// Components
import Room from './components/Room';
import React from 'react';
import Login from './components/Login';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

// Styles
import 'semantic-ui-css/semantic.min.css';
import './css/app.css';

ReactDOM.render(
    (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/room" component={Room} />
                <Redirect from='/' to='/login' exact="true"/>
            </Switch>
        </BrowserRouter>
    ),
    document.getElementById('root')
);
