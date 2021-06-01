import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Group, Panel, PanelHeader, PanelHeaderBack, RichCell} from '@vkontakte/vkui';
import {Backend} from "../../services/backendConnect";


class UserInvites extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            purchases: [],
        }
    }

    componentDidMount() {
        Backend.callMethod('get', 'invites/get').then((response) => {
            if (response !== false)
                this.setState({purchases: response})
            else
                this.props.go('error')

        })
    }

    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={this.props.goNode} data-to="main"/>}
                >
                    Ваши приглашения
                </PanelHeader>
                <Group>
                    {
                        this.state.purchases.map(purchase => {
                            return (<Purchase go={this.props.go} key={purchase.id} purchase={purchase}/>)
                            }
                        )
                    }
                </Group>
            </Panel>
        )
    }
}

class Purchase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            refused: false
        }

        this.confirmInvite = this.confirmInvite.bind(this)
        this.refuseInvite = this.refuseInvite.bind(this)
    }

    confirmInvite() {
        Backend.callMethod('get', 'invites/confirm', {invite_id: this.props.purchase.id}).then(
            response => {
                if (response !== false) {
                    Backend.purchase_id = response.added_to
                    this.props.go('purchase')
                } else
                    this.props.go('error')

            })
    }

    refuseInvite(){
        Backend.callMethod('get', 'invites/refuse', {invite_id: this.props.purchase.id}).then((response) => {console.log(response);
            if (response !== false)
                this.setState({refused: true})
            else
                this.props.go('error')

        })
    }

    render() {
        return (
            <RichCell
                before={
                    <Div>
                        <Div>
                            {this.props.purchase.title}
                        </Div>
                        <Div>
                            {this.props.purchase.description}
                        </Div>
                    </Div>
                }

                after={
                    this.state.refused === false && (
                        <Group>

                            <Div>
                                <Button onClick={this.confirmInvite}>Принять</Button>
                            </Div>
                            <Div>
                                <Button mode="danger" onClick={this.refuseInvite}>Отменить</Button>
                            </Div>
                        </Group>
                    )
                }
            />
        )
    }
}


UserInvites.propTypes = {
    id: PropTypes.string.isRequired,
    goNode: PropTypes.func.isRequired
};


export default UserInvites;
