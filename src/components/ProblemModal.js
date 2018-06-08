import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

class ProblemModal extends Component {

    constructor(props) {
        super(props);

        this.reloadPage = this.reloadPage.bind(this);
    }

    /**
     * Reloads current page.
     */
    reloadPage() {
        window.location.reload();
    }

    render() {
        return (
            <Modal
                size="mini"
                open={this.props.open}
            >
                <Modal.Header>Connection problem</Modal.Header>
                <Modal.Content>
                    <p>A problem has occurred with connection to API server. Try to reload the page.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary labelPosition='right' icon='refresh' content='Reload' onClick={this.reloadPage} />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ProblemModal;