import React from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Button,
    Div, IconButton,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    RichCell
} from '@vkontakte/vkui';
import {Backend} from "../../services/backendConnect";
import bridge from "@vkontakte/vk-bridge";
import {Icon24Info} from "@vkontakte/icons";


class PurchaseBill extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            purchase: {},
        }

        this.back = this.back.bind(this)
    }

    componentDidMount() {
        Backend.callMethod('get', 'purchase/get', {purchase_id: Backend.purchase_id}).then(response => {
            if (response !== false)
                this.setState({purchase: response})
        })
    }

    back(){
        Backend.purchase_id = undefined
        this.props.go('main')
    }

    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader left={<PanelHeaderBack onClick={this.back}/>}>
                    {this.state.purchase.title}
                </PanelHeader>

                <Div>
                    <Button stretched size="l" mode='secondary' onClick={this.props.goNode} data-to="purchaseInfo">
                        Информация
                    </Button>
                </Div>

                <BillsList go={this.props.go}/>
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
        return this.state.users_data.map(user_data => (<TargetBill user_data={user_data} {...this.props}/>))
    }
}


class TargetBill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bill: 0,
            status: undefined
        }

        this.buttonClick = false

        this.confirmSend = this.confirmSend.bind(this)
        this.showTargetBill = this.showTargetBill.bind(this)
    }

    componentDidMount() {
        let params = {
            purchase_id: Backend.purchase_id,
            target_id: this.props.user_data.id
        }

        Backend.callMethod('get', 'bill/get', params).then(response => {
            if (response !== false)
                Backend.callMethod('get', 'bill/status', params).then(status_response => {
                    if (status_response !== false)
                        this.setState({status: status_response.status, bill: response.bill})
                })
        })
    }

    confirmSend(){
        this.buttonClick = true

        let params = {
            purchase_id: Backend.purchase_id,
            target_id: this.props.user_data.id
        }
        Backend.callMethod('get', 'bill/confirm', params).then(response => {
            if (response !== false)
                this.setState({status: 'confirm'})
        })
    }

    showTargetBill(){
        if (!this.buttonClick) {
            Backend.target_id = this.props.user_data.id
            this.props.go('userBill')
        }
        else
            this.buttonClick = false

    }

    render() {
        let props = {}
        if (this.props.user_data.id != Backend.authParams.user_id)
            switch (this.state.status) {
                case 'wait':
                    props.caption = 'Пользователь ещё не скинулся'
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
                text={`${this.state.bill} ₽`}
                {...props}
                onClick={this.showTargetBill}
            >
                {this.props.user_data.first_name} {this.props.user_data.last_name}
            </RichCell>
        )
    }
}


PurchaseBill.propTypes = {
    id: PropTypes.string.isRequired,
    goNode: PropTypes.func.isRequired
};


export default PurchaseBill;
