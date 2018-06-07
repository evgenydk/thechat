import logo from '../images/logo.svg';
import React from 'react';
import config from '../config';
import SailsSocket from 'sails-socket'
import {
    Grid, Image, Segment, Menu,
    Card, Button,Comment, Form,
    Header, Feed } from 'semantic-ui-react'

import userIcon from '../images/user.svg';

class Room extends React.Component {
    /**
     * Constructor.
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            currentUser: {},
            message: '',
            messages: [],
            users: []
        };

        this.logout = this.logout.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.updateOnlineUsers = this.updateOnlineUsers.bind(this);
        this.handleMessageFormSubmit = this.handleMessageFormSubmit.bind(this);
        this.handleMessageInputChange = this.handleMessageInputChange.bind(this);

        SailsSocket.connect({ url: config.API_URL });
        SailsSocket.on('message', this.updateMessages);
        SailsSocket.on('keepalive', this.updateOnlineUsers);
    }

    /**
     * Executes after the component has loaded.
     */
    componentDidMount() {
        this.authenticate(() => {
            this.join();
            this.getMessages();

            // Sending keepAlive on a regular basis
            setInterval(() => this.sendKeepAlive(), 1000)
        });
    }

    /**
     * Keep online users list in actual state.
     *
     * @param {object} user
     */
    updateOnlineUsers(user) {
        let username = user.nickname;

        if (this.state.users.includes(username)) {
            return;
        }

        this.setState({
            users: [...this.state.users, username]
        });
    }

    /**
     * Updates messages list when a new one arrives.
     *
     * @param {object} message
     */
    updateMessages(message) {
        this.setState({
            messages: [...this.state.messages, message]
        });
    }

    /**
     * User authentication.
     *
     * @param {function} callback
     */
    authenticate(callback) {
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
            callback();
        });
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
     * Sends keepAlive packet through WS.
     */
    sendKeepAlive() {
        SailsSocket.post('/chat/keepalive', {
            nickname: this.state.currentUser.nickname
        });
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
                                {this.state.users && this.state.users.map((nickname, i) =>
                                    <Feed key={i}>
                                        <Feed.Event>
                                            <Feed.Label image={userIcon} />
                                            <Feed.Content>
                                                <Feed.Summary>
                                                    {nickname}
                                                </Feed.Summary>
                                            </Feed.Content>
                                        </Feed.Event>
                                    </Feed>
                                )}
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
                                    {this.state.messages && this.state.messages.map((message, i) =>
                                        <Comment key={i}>
                                            <Comment.Avatar src={userIcon} />
                                            <Comment.Content>
                                                <Comment.Author as='a'>{message.sender}</Comment.Author>
                                                <Comment.Metadata>
                                                    <span>{new Date(message.createdAt).toLocaleString("en-US")}</span>
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