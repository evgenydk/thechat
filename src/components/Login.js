import React, { Component } from 'react';
import { Alert, Button, Form, FormFeedback, FormGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUsernameTaken: false
        };

        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    handleLoginClick(event) {
        console.dir('asdas');
        this.state.isUsernameTaken = true;
        event.preventDefault();
    }

    render() {
        const isUsernameTaken = this.state.isUsernameTaken;

        return (
            <div className="form-wrapper">
                <div className="rounded shadow-lg p-3 mb-5 bg-white bg-white w-25">
                    <Alert color="secondary">
                        Welcome to the chat! Please type your username below to login.
                    </Alert>
                    <Form>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                                <Input id="username" placeholder="username" invalid={isUsernameTaken} />
                                <FormFeedback>Unfortunately, this username is in use now. Try another one</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" block onClick={this.handleLoginClick}>Login</Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;