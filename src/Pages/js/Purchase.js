import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Div,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    TooltipContainer,
    Cell,
    Avatar,
    Snackbar,
    IconButton,
    SubnavigationBar,
    SubnavigationButton,
    RichCell
} from '@vkontakte/vkui';

import {Backend} from "../../services/backendConnect";
import {Icon16Block, Icon16Done, Icon28EditOutline} from "@vkontakte/icons";


const IsOwnerContext = React.createContext(undefined)


class Purchase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            purchase: {},
            snackbar: null,
            is_owner: false,
            bill: 0
        }
    }

    componentDidMount() {
        this.updateBill()
        Backend.callMethod('get', 'purchase/get', {purchase_id: Backend.purchase_id}).then(
            response => {
                if (response !== false) {
                    this.setState({
                        purchase: response,
                        is_owner: response.is_owner
                    })
                } else
                    this.props.go('error')
            }
        )
    }

    updateBill = () => {
        Backend.callMethod('get', 'bill/get', {purchase_id: Backend.purchase_id}).then(response => {
            if (response !== false) {
                this.setState({bill: response.bill})
            } else
                this.setNotification('error', false)
        })
    }

    setNotification = (text, status) => {
        let icon
        if (status === true)
            icon =
                <Avatar size={24} style={{background: 'var(--accent)'}}><Icon16Done fill="#fff" width={14} height={14}/></Avatar>
        else
            icon = <Avatar size={24} style={{background: 'var(--destructive)'}}><Icon16Block fill="#fff" width={14}
                                                                                             height={14}/></Avatar>

        this.setState({
            snackbar:
                <Snackbar before={icon} onClose={() => this.setState({snackbar: null})}>
                    {text}
                </Snackbar>
        })
    }

    render() {
        return (
            <Panel id={this.props.id}>
                <IsOwnerContext.Provider value={this.state.is_owner}>

                    <PanelHeader left={<PanelHeaderBack onClick={this.props.goNode} data-to="main"/>}>
                        {this.state.purchase.title}
                    </PanelHeader>

                    <Div>
                        <Button stretched size="l" mode='secondary' onClick={this.props.goNode} data-to="purchaseInfo">
                            Информация
                        </Button>
                    </Div>

                    <ProductsList go={this.props.go} setNotification={this.setNotification} updateBill={this.updateBill}/>
                    <RichCell disabled/>

                    <TooltipContainer fixed style={{position: 'fixed', bottom: 10, width: '100%'}}>
                        <SubnavigationBar mode="fixed">
                            <SubnavigationButton size="l">
                                {this.state.bill} ₽
                            </SubnavigationButton>

                            <IsOwnerContext.Consumer>
                                {is_owner => {
                                    if (is_owner)
                                        return (
                                            <SubnavigationButton size="l" selected stretched onClick={this.props.goNode}
                                                    data-to="editProduct">Добавить</SubnavigationButton>
                                        )
                                }}
                            </IsOwnerContext.Consumer>

                        </SubnavigationBar>
                    </TooltipContainer>

                    {this.state.snackbar}
                </IsOwnerContext.Provider>
            </Panel>
        )
    }
}


class ProductsList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            products: []
        }
    }

    componentDidMount() {
        Backend.callMethod('get', 'products/get_all', {purchase_id: Backend.purchase_id}).then(
            response =>  {
                if (response)
                    this.setState({products: response})

                else
                    this.props.go('error')

            }
        )
    }

    render() {
        if (this.state.products.length > 0)
            return this.state.products.map(
                product => <Product
                    key={product.id}
                    product={product}
                    go={this.props.go}
                    updateBill={this.props.updateBill}
                    setNotification={this.props.setNotification}/>
            )

        else
            return (
                <Div>
                    Продукты не найденны
                </Div>
            )
    }
}


class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            picked: this.props.product.picked
        }

        this.pick = this.pick.bind(this)
        this.showEdit = this.showEdit.bind(this)
    }

    pick() {
        let params = {
            purchase_id: Backend.purchase_id,
            product_id: this.props.product.id,
            product_status: !this.state.picked
        }

        Backend.callMethod('get', 'bill/pick', params).then(response => {
            if (response !== false) {
                this.props.updateBill()
                this.setState({picked: !this.state.picked})
            } else
                this.props.setNotification('error', false)
        })
    }

    showEdit(){
        Backend.product_id = this.props.product.id
        this.props.go('editProduct')
    }

    render() {
        let after = (
            <IsOwnerContext.Consumer>
                {is_owner => {
                    if (is_owner)
                        return (
                            <IconButton onClick={this.showEdit}>
                                <Icon28EditOutline/>
                            </IconButton>
                        )
                }}
            </IsOwnerContext.Consumer>
        )

        return (
            <Cell selectable defaultChecked={this.state.picked} onChange={this.pick}
                  before={this.props.product.title}

                  indicator={<Div>{this.props.product.cost} ₽</Div>}
                  description={<Div>{this.props.product.description}</Div>}

                  after={after}
                  />
        )
    }
}


Purchase.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};


export default Purchase;