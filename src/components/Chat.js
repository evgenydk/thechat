import config from '../config';
import React from 'react';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Container,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavText,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

class Chat extends React.Component {
    /**
     * Constructor.
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            socket: null,
            isOpen: false,
            currentUser: {},
            messages: []
        };
        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    /**
     * Populate chat with messages.
     */
    getChatMessages() {
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

            // Otherwise save his user object and create
            // a socket for out connection with back-end
            this.setState({
                currentUser: data.body,
                socket: new WebSocket(config.API_URL_WS)
            });

            // Populate messages after login
            this.getChatMessages();
            this.state.socket.send('sd');
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

    render() {
        return (
            <Container className="h-100">
                <Row>
                    <Col>
                        <Navbar color="dark" dark expand="md">
                            <NavbarBrand href="/">theChat</NavbarBrand>
                            <NavbarToggler onClick={this.toggle} />
                            <Collapse isOpen={this.state.isOpen} navbar>
                                        <span className="navbar-text">
                                            Hello, <span className="font-weight-bold">{this.state.currentUser.nickname}</span>
                                        </span>
                                <Button color="danger" onClick={this.logout}>Log out</Button>
                            </Collapse>
                        </Navbar>
                    </Col>
                </Row>
                <Row>
                    <Col xs="3">
                        <ListGroup>
                            <ListGroupItem>Cras justo odio</ListGroupItem>
                            <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                            <ListGroupItem>Morbi leo risus</ListGroupItem>
                            <ListGroupItem>Porta ac consectetur ac</ListGroupItem>
                            <ListGroupItem>Vestibulum at eros</ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col>
                        <Row className="h-75">

                        </Row>
                        <Row>
                            <Form>
                                <FormGroup>
                                    <Label for="exampleEmail">Email</Label>
                                    <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                                </FormGroup>
                            </Form>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Chat;