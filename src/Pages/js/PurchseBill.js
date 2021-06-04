import React from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Button,
    Cell,
    CellButton,
    Div,
    IconButton,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    RichCell
} from '@vkontakte/vkui';
import {Backend} from "../../services/backendConnect";
import {
    Icon12CheckCircle,
    Icon20BookOutline,
    Icon20NotebookCheckOutline, Icon24Info, Icon24InfoCircleOutline,
    Icon28CheckCircleFill, Icon28InfoCircleOutline, Icon36Done
} from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";

const IsOwnerContext = React.createContext(undefined)

class PurchaseBill extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            is_owner: undefined,
            bill: undefined
        }
    }

    componentDidMount() {
        Backend.callMethod('get', 'purchase/is_owner', {purchase_id: Backend.purchase_id}).then(response => {
            if (response !== false)
                this.setState({is_owner: response.is_owner})
        })
    }

    render() {
        return(
            <Panel id={this.props.id}>
                <IsOwnerContext.Provider value={this.state.is_owner}>
                    <PanelHeader
                        left={<PanelHeaderBack onClick={this.props.goNode} data-to="main"/>}
                    >
                        Скинемся
                    </PanelHeader>
                    <Div>
                        <Button stretched size="l" mode='secondary' onClick={this.props.goNode} data-to="purchaseInfo">
                            Информация
                        </Button>
                    </Div>


                    <IsOwnerContext.Consumer>
                        {is_owner => {
                            switch (is_owner){
                                case true:
                                    return <BillsList/>
                                case false:
                                    return <UserBill/>
                            }
                        }}
                    </IsOwnerContext.Consumer>
                </IsOwnerContext.Provider>
            </Panel>
        )
    }
}


class BillsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users_data: []
        }
    }

    componentDidMount() {
        Backend.callMethod('get', 'bill/get_all', {purchase_id: Backend.purchase_id}).then(response => {
            if (response !== false)
                this.loadUsersData(response)
        })
    }

    loadUsersData(bills) {
        try {
            bridge.send('VKWebAppCallAPIMethod', {
                method: 'users.get',
                params: {
                    user_ids: bills.join(', '),
                    fields: 'photo_100',
                    v: "5.131",
                    request_id: 0,
                    access_token: Backend.vk_token
                }

            }).then(response => this.setState({users_data: response.response}))
        }
        catch {}
    }

    render() {
        return this.state.users_data.map(user_data => (<TargetBill user_data={user_data}/>))
    }
}


class TargetBill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bill: {
                bill: 0
            },
            chosen: false,
            status: undefined
        }

        this.confirmSend = this.confirmSend.bind(this)
    }

    componentDidMount() {
        let params = {
            purchase_id: Backend.purchase_id,
            target_id: this.props.user_data.id
        }
        console.log(params)
        Backend.callMethod('get', 'bill/get', params).then(response => {
            if (response !== false)
                Backend.callMethod('get', 'bill/status', params).then(status_response => {
                    if (status_response !== false)
                        this.setState({status: status_response.status, bill: response})
                })
        })
    }

    confirmSend(){
        let params = {
            purchase_id: Backend.purchase_id,
            target_id: this.props.user_data.id
        }
        Backend.callMethod('get', 'bill/confirm', params).then(response => {
            if (response !== false)
                this.setState({status: 'confirm'})
        })
    }

    render() {
        let props = {}
        console.log(this.state.status, this.props.user_data.id)
        if (this.props.user_data.id != Backend.authParams.user_id)
            switch (this.state.status) {
                case 'wait':
                    props.caption = 'Ещё не скинулся'
                    break

                case 'sent':
                    props.actions = <Button onClick={this.confirmSend}>Подтвердить</Button>
                    break

                case 'confirm':
                    props.caption = 'Подтвержденно'
                    break
            }

        else
            props.caption = 'Это вы'

        return (
            <RichCell
                multiline
                before={<Avatar size={72} src={this.props.user_data.photo_100} />}
                text={`${this.state.bill.bill} ₽`}
                {...props}
            >
                {this.props.user_data.first_name} {this.props.user_data.last_name}
            </RichCell>
        )
    }
}


class UserBill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bill: {}
        }
    }

    componentDidMount() {
        // Backend.callMethod('get', 'bill/get').then(response => {
        //     if (response !== false)
        //         this.setState({bill: response})
        // })
    }


    render() {
        return(
            <Div>1234444</Div>
        )
    }
}


PurchaseBill.propTypes = {
    id: PropTypes.string.isRequired,
    goNode: PropTypes.func.isRequired
};


export default PurchaseBill;
