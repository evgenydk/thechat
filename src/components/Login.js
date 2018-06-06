import React, { Component } from 'react';
import {
    Alert,
    Button,
    Form,
    FormFeedback,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Input } from 'reactstrap';

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
            error: ''
        };
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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

        fetch('http://localhost:1337/user/signup', {
            method: 'PUT',
            body: JSON.stringify({
                nickname: username
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(data => {console.dir(data);
            // If nickname is taken right now
            if (data.code !== 201) {
                return this.setState({ error: data.body.error });
            }

            // If user has been created
            this.props.history.push('/chat');
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
            error: ''
        });
    }

    render() {
        const error = this.state.error;
        const isError = error !== '';

        return (
            <div className="form-wrapper">
                <div className="rounded shadow-lg p-3 mb-5 bg-white bg-white w-25">
                    <Alert color="secondary">
                        Welcome to the chat! Please type your username below to login.
                    </Alert>
                    <Form onSubmit={this.handleLoginClick}>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                                <Input
                                    id="username"
                                    placeholder="username"
                                    value={this.state.username}
                                    invalid={isError}
                                    onChange={this.handleInputChange}
                                    autoComplete="off"
                                />
                                <FormFeedback>{error}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Button
                                color="primary"
                                onClick={this.handleLoginClick}
                                disabled={this.state.isUsernameEmpty}
                                block
                            >Login</Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;