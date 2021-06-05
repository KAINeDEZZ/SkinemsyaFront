import React from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Button,
    Div,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    RichCell, SubnavigationBar, SubnavigationButton, TooltipContainer
} from '@vkontakte/vkui';
import {Backend} from "../../services/backendConnect";
import bridge from "@vkontakte/vk-bridge";


class UserBill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bill: 0,
            status: undefined,
            products: [],
            title: ''
        }

        this.setSentStatus = this.setSentStatus.bind(this)
        this.back = this.back.bind(this)
    }

    componentDidMount() {
        this.loadTitle()
        let params = {purchase_id: Backend.purchase_id}
        if (Backend.target_id)
            params.target_id = Backend.target_id

        Backend.callMethod('get', 'bill/get', params).then(response => {
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

    loadTitle(){
        if (Backend.target_id)
            try {
                bridge.send('VKWebAppCallAPIMethod', {
                    method: 'users.get',
                    params: {
                        user_ids: Backend.target_id,
                        v: "5.131",
                        request_id: 0,
                        access_token: Backend.vk_token
                    }

                }).then(response => {
                    let user_data = response.response[0]
                    this.setState({title: `${user_data.first_name} ${user_data.last_name}`})
                })
            }
            catch {}
        else
            Backend.callMethod('get', 'purchase/get', {purchase_id: Backend.purchase_id}).then(
                response => {
                    if (response !== false)
                        this.setState({title: response.title})
                }
            )
    }

    setSentStatus() {
        Backend.callMethod('get', 'bill/set_sent', {purchase_id: Backend.purchase_id}).then(response => {
            if (response !== false)
                this.setState({status: 'sent'})
        })
    }

    back() {
        if (Backend.target_id) {
            this.props.go('purchaseBill')
            Backend.target_id = undefined
        } else
            this.props.go('main')
    }

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader left={<PanelHeaderBack onClick={this.back}/>}>
                    {this.state.title}
                </PanelHeader>

                {
                    !Backend.target_id &&
                    <Div>
                        <Button stretched size="l" mode='secondary' onClick={this.props.goNode} data-to="purchaseInfo">
                            Информация
                        </Button>
                    </Div>
                }

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

                <TooltipContainer fixed style={{position: 'fixed', bottom: 0, width: '100%'}}>
                    <SubnavigationBar mode="fixed">
                        <SubnavigationButton disabled size="l">
                            {this.state.bill} ₽
                        </SubnavigationButton>

                        {
                            (this.state.status === 'wait' && !Backend.target_id) &&
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


export default UserBill