import config from '../config';
import React, { Component } from 'react';
import { Button, Form, Input, Icon, Message } from 'semantic-ui-react'

class Login extends Component {
    /**
     * Constructor.
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            isUsernameEmpty: true,
            username: '',
            error: null,
            isProcessing: false
        };
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /**
     * First check whether the user is already
     * logged in and redirect him to the chat
     * in case he is.
     */
    componentDidMount() {
        fetch(`${config.API_URL}/user/check`, {
            method: 'PUT',
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.body.uuid) {
                return this.props.history.push('/room');
            }
        });
    }

    /**
     * Handles login button click.
     *
     * @param event
     */
    handleLoginClick(event) {
        event.preventDefault();

        const username = this.state.username;

        // Do not proceed if username is empty
        if (username.trim().length === 0) {
            return;
        }

        // Logging in is processing
        this.setState({ isProcessing: true });

        fetch(`${config.API_URL}/user/signup`, {
            method: 'PUT',
            body: JSON.stringify({
                nickname: username
            }),
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ isProcessing: false });

            // If nickname is taken right now
            if (data.code !== 201) {
                return this.setState({ error: data.body.error });
            }

            // If user has been created
            this.props.history.push('/room');
        });
    }

    /**
     * Handles username input changes.
     *
     * @param event
     */
    handleInputChange(event) {
        const value = event.target.value;
        const isEmpty = value.trim().length === 0;

        this.setState({
            isUsernameEmpty: isEmpty,
            username: value,
            error: null
        });
    }

    render() {
        const errorText = this.state.error;
        const isError = errorText !== null;

        return (
            <div className="form-wrapper">
                <div className="login-form">
                    <Message info>
                        <Message.Header>Welcome to the chat!</Message.Header>
                        <p>Please type your username below to login.</p>
                    </Message>
                    <Form onSubmit={this.handleLoginClick} error={isError}>
                        <Form.Field>
                            <Input iconPosition='left'>
                                <Icon name='at' />
                                <input
                                    id="username"
                                    placeholder="username"
                                    value={this.state.username}
                                    onChange={this.handleInputChange}
                                    autoComplete="off"
                                />
                            </Input>
                            { isError ? <Message error header='Login error' content={errorText} /> : '' }
                        </Form.Field>
                        <Button
                            primary
                            onClick={this.handleLoginClick}
                            disabled={this.state.isUsernameEmpty}
                            fluid
                            loading={this.state.isProcessing}
                            type='submit'>Submit</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;