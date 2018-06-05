import React, { Component } from 'react';
import { Alert, Button, Form, FormFeedback, FormGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap';

class Login extends Component {
    /**
     * Constructor.
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            isUsernameTaken: false,
            isUsernameEmpty: true,
            username: ''
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

        const takenUsernames = ['lol', 'kek', 'cheburek'];
        const isTaken = takenUsernames.includes(this.state.username);

        if (isTaken) {
            return this.setState({isUsernameTaken: isTaken});
        }

        this.props.history.push('/chat');
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
            isUsernameTaken: false,
            isUsernameEmpty: isEmpty,
            username: value
        });
    }

    render() {
        const isUsernameTaken = this.state.isUsernameTaken;

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
                                    invalid={isUsernameTaken}
                                    onChange={this.handleInputChange}
                                    autocomplete="off"
                                />
                                <FormFeedback>Unfortunately, this username is in use now. Try another one</FormFeedback>
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