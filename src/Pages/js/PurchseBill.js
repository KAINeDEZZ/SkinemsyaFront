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
    RichCell, SubnavigationBar, SubnavigationButton, TooltipContainer
} from '@vkontakte/vkui';
import {Backend} from "../../services/backendConnect";
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
            bill: 0,
            status: undefined,
            products: []
        }

        this.setSentStatus = this.setSentStatus.bind(this)
    }

    componentDidMount() {
        Backend.callMethod('get', 'bill/get', {purchase_id: Backend.purchase_id}).then(response => {
            if (response !== false)
                Backend.callMethod('get', 'bill/status', {purchase_id: Backend.purchase_id}).then(status_response => {
                    if (status_response !== false)
                        this.setState({
                            status: status_response.status,
                            bill: response.bill,
                            products: response.products
                        })
                })
        })
    }

    setSentStatus() {
        Backend.callMethod('get', 'bill/set_sent', {purchase_id: Backend.purchase_id}).then(response => {
            if (response !== false)
                this.setState({status: 'sent'})
        })
    }


    render() {
        return (
            <Panel id={'bill'}>
                {
                    this.state.products.map(product_data => {
                        let props = {}
                        if (product_data.description)
                            props.text = product_data.description

                        return (
                            <RichCell
                                text={product_data.description}
                                after={`${product_data.user_cost} ₽`}
                                caption={`Общая цена: ${product_data.cost} ₽`}
                                {...props}
                            >
                                {product_data.title}
                            </RichCell>
                        )
                    })
                }

                <RichCell disabled/>

                <TooltipContainer fixed style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                    <SubnavigationBar mode="fixed">
                        <SubnavigationButton disabled size="l">
                            {this.state.bill} ₽
                        </SubnavigationButton>

                        {
                            this.state.status === 'wait' &&
                            <SubnavigationButton size="l" selected stretched onClick={this.setSentStatus}>
                                Скинулся
                            </SubnavigationButton>
                        }

                    </SubnavigationBar>
                </TooltipContainer>
            </Panel>
        )
    }
}


PurchaseBill.propTypes = {
    id: PropTypes.string.isRequired,
    goNode: PropTypes.func.isRequired
};


export default PurchaseBill;
