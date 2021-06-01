import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Input, Panel, PanelHeader, PanelHeaderBack} from '@vkontakte/vkui';


import {Backend} from "../../services/backendConnect";


class InviteMembers extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            target_id: ''
        }

        this.sendInvite = this.sendInvite.bind(this)
        this.handleChanges = this.handleChanges.bind(this)
    }

    handleChanges(el){
        this.setState({target_id: el.target.value})
    }

    sendInvite(){
        Backend.callMethod('get', 'invites/create', Object.assign({}, {purchase_id: Backend.purchase_id}, this.state)).then(
            response =>  {
                if (response !== false) {
                    this.props.go('purchaseInfo')
                }
                else
                    this.props.go('error')
            }
        )
    }

    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={this.props.goNode} data-to="purchaseInfo"/>}
                >
                    Скинемся
                </PanelHeader>
                <Div>
                    <Input onChange={this.handleChanges}/>
                </Div>
                <Div>
                    <Button stretched size='l' onClick={this.sendInvite}>Ok</Button>
                </Div>
            </Panel>
        )
    }
}


InviteMembers.propTypes = {
    id: PropTypes.string.isRequired,
    goNode: PropTypes.func.isRequired
};


export default InviteMembers;
