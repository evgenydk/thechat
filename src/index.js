// Components
import Chat from './components/Chat';
import React from 'react';
import Login from './components/Login';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';

ReactDOM.render(
    (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/chat" component={Chat} />
                <Redirect from='/' to='/login' exact="true"/>
            </Switch>
        </BrowserRouter>
    ),
    document.getElementById('root')
);
