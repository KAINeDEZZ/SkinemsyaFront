import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Div,
    Input,
    Panel,
    PanelHeader,
    Cell,
    PanelHeaderBack,
    Avatar,
    Group,
    CellButton, TooltipContainer, List, RichCell
} from '@vkontakte/vkui';

import {Backend} from "../../services/backendConnect";
import {PurchaseContext, PurchaseID} from "../../services/context";


class Purchase extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            purchase: {}
        }
    }

    componentDidMount() {
        // console.log(PurchaseContext.)

        Backend.callMethod('get', 'purchase/get', {purchase_id: Backend.purchase_id}).then(
            response =>  {
                if (response !== false) {
                    this.setState({purchase: response})
                }
                else
                    this.props.go('error')
            }
        )
    }

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader left={<PanelHeaderBack onClick={this.props.goNode} data-to="main"/>}>
                    {this.state.purchase.title}
                </PanelHeader>

                <Div>
                    <Button stretched size="l" mode='secondary' onClick={this.props.goNode} data-to="purchaseInfo">ИНФОРМАЦИЯ</Button>
                </Div>
                <Div>
                    Пока что отключил продукты
                </Div>
                {/*<ProductsList go={this.props.go}/>*/}

                {
                    this.state.purchase.is_owner === 1 &&
                    <TooltipContainer fixed style={{position: 'fixed', bottom: 10, width: '100%'}}>
                        <Div>
                            <Button size="l" stretched onClick={this.props.goNode}
                                    data-to="editProduct">ДОБАВИТЬ</Button>
                        </Div>
                    </TooltipContainer>
                }
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
        Backend.callMethod('get', 'get_products', {purchase_id: Backend.purchase_id}).then(
            response =>  {
                if (response) {
                    this.setState({products: response})
                }
                else
                    this.props.go('error')

            }
        )
    }

    render() {
        if (this.state.products.length > 0)
            return this.state.products.map(
                (product) => <Product key={product.id} product={product} go={this.props.go}/>)
        else {
            return (
                <Div>
                    Продукты не найденны
                </Div>
            )
        }
    }
}


class Product extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <RichCell
                      before={
                          <Div>
                              <Div>
                                  {this.props.product.title}
                              </Div>
                              <Div>
                                  {this.props.product.description}
                              </Div>
                          </Div>
                      }

                      after={
                          <Div>
                              Цена: {this.props.product.cost}
                          </Div>
                      }/>
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