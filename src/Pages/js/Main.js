import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import {
	Panel,
	PanelHeader,
	Button,
	Div,
	Input, List, Cell, RichCell, TooltipContainer,
} from '@vkontakte/vkui';

import {Backend} from "../../services/backendConnect";


class Main extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			purchases: []
		}
	}

	componentDidMount() {
		Backend.callMethod('get', 'get_all_purchases').then((response) => {
			if (response)
				this.setState({purchases: response})
		})
	}

	render() {
		return (
			<Panel id={this.props.id}>
				<PanelHeader>
					Скинемся
				</PanelHeader>

				<Div>
					<Input/>
				</Div>

				<Div>
					<PurchasesList purchases={this.state.purchases} go={this.props.go}/>
				</Div>

				<TooltipContainer fixed style={{ position: 'fixed', bottom: 0, width: '100%' }}>
					<Div>
						<Button stretched size="l" onClick={this.props.goNode} data-to="editPurchase">
							ДОБАВИТЬ ВКИД
						</Button>
					</Div>
				</TooltipContainer>
			</Panel>
		)
	}
}


class PurchasesList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<List>
				{
					this.props.purchases.length !== 0 && this.props.purchases.map((purchase) => (
						<Purchase key={purchase.id} purchase={purchase} go={this.props.go}/>
					))
				}
				{
					this.props.purchases.length === 0 &&
						<Div>
							Вкиды не найденны
						</Div>
				}
			</List>
		)
	}
}


class Purchase extends React.Component {
	constructor(props) {
		super(props);
		this.purchase = props.purchase

	}

	choosePurchase(){
		Backend.purchase_id = this.purchase.id
		this.props.go('purchase')
	}

	render() {
		return (
			<RichCell onClick={this.choosePurchase.bind(this)}
				before={
					<Div>
						<Div>
							{this.purchase.title}
						</Div>
						<Div>
							{this.purchase.description}
						</Div>
					</Div>
			}

				after={
					<Div>
						<Div>
							{this.purchase.status}

						</Div>
						<Div>
							{this.purchase.billing_at}
						</Div>
					</Div>
				}/>
		)
	}
}


Main.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	goNode: PropTypes.func.isRequired,
};

export default Main;
