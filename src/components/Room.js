import logo from '../images/logo.svg';
import user from '../images/user.svg';
import React from 'react';
import config from '../config';
import SailsSocket from 'sails-socket'
import {
    Grid, Image, Segment, Menu,
    Card, Button,Comment, Form,
    Header, Feed } from 'semantic-ui-react'

SailsSocket.connect({ url: config.API_URL });

class Room extends React.Component {
    /**
     * Constructor.
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            currentUser: {},
            message: '',
            messages: []
        };
        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.handleMessageFormSubmit = this.handleMessageFormSubmit.bind(this);
        this.handleMessageInputChange = this.handleMessageInputChange.bind(this);
    }

    /**
     * Check whether the user is logged in and redirect
     * him to the login page if he is not.
     */
    componentDidMount() {
        fetch(`${config.API_URL}/user/check`, {
            method: 'PUT',
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
            // If user not logged then redirect him
            if (!data.body.uuid) {
                return this.props.history.push('/login');
            }

            // Otherwise save his user object
            this.setState({ currentUser: data.body });
            this.join();
            this.getMessages();

            SailsSocket.on('/chat', data => {
                console.dir(data);
            });
        });
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    /**
     * Populate chat with messages.
     */
    getMessages() {
        fetch(`${config.API_URL}/chat/populate?offset=10`, {
            method: 'GET',
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.code !== 200) {
                return;
            }

            this.setState({
                messages: data.body.messages
            });
        });
    }

    /**
     * Join the chat.
     */
    join() {
        SailsSocket.put('/chat/join');
    }

    /**
     * Sends message to the chat.
     *
     * @param {string} message
     */
    sendMessage(message) {
        const currentUser = this.state.currentUser;

        SailsSocket.put('/chat/chat', {
            sender: currentUser.nickname,
            message: message,
            guid: currentUser.uuid
        });

        this.setState({ message: '' });
    }

    /**
     * Handles submitting the new message form.
     *
     * @param event
     */
    handleMessageFormSubmit(event) {
        event.preventDefault();
        this.sendMessage(this.state.message);
    }

    /**
     * Handles changes in the message input.
     *
     * @param event
     */
    handleMessageInputChange(event) {
        const message = event.target.value.trim();

        // Do not allow to send empty messages
        if (message.length === 0) {
            return;
        }

        this.setState({ message: message });
    }

    /**
     * Log out current user from the chat.
     */
    logout() {
        fetch(`${config.API_URL}/user/logout`, {
            method: 'GET',
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
            // Redirect browser to the login page in
            // case of successful logging out
            if (data.code === 200) {
                this.props.history.push('/login');
            }
        });
    }

    render() {
        return (
            <Grid columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Menu stackable>
                            <Menu.Item>
                                <img src={logo} />
                            </Menu.Item>
                            <Menu.Item>
                                Hello, {this.state.currentUser.nickname}!
                            </Menu.Item>
                            <Menu.Menu position='right'>
                                <Menu.Item onClick={this.logout}>
                                    Log out
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={2}>
                    <Grid.Column width={4}>

                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Users online</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Feed>
                                    <Feed.Event>
                                        <Feed.Label image={user} />
                                        <Feed.Content>
                                            <Feed.Summary>
                                                username
                                            </Feed.Summary>
                                        </Feed.Content>
                                    </Feed.Event>
                                </Feed>
                            </Card.Content>
                        </Card>

                    </Grid.Column>
                    <Grid.Column width={12}>

                        <Segment>
                            <Comment.Group minimal>
                                <Header as='h3' dividing>
                                    Chat
                                </Header>

                                <div className="comments-fixed">
                                    {this.state.messages.map((message, i) =>
                                        <Comment key={i}>
                                            <Comment.Avatar src={user} />
                                            <Comment.Content>
                                                <Comment.Author>{message.sender}</Comment.Author>
                                                <Comment.Metadata>
                                                    <span>Today at 5:42PM</span>
                                                </Comment.Metadata>
                                                <Comment.Text>{message.message}</Comment.Text>
                                            </Comment.Content>
                                        </Comment>
                                    )}
                                </div>

                                <Form onSubmit={this.handleMessageFormSubmit}>
                                    <Form.Group>
                                        <Form.Input
                                            placeholder='Type your message'
                                            value={this.state.message}
                                            onChange={this.handleMessageInputChange}
                                            width={14} />
                                        <Button content='Send' labelPosition='left' icon='send' primary />
                                    </Form.Group>
                                </Form>
                            </Comment.Group>
                        </Segment>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Room;