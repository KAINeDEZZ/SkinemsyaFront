import React from 'react';
import PropTypes from 'prop-types';

import {
	Panel,
	PanelHeader,
	Button,
	Div,
	Input, List, RichCell, TooltipContainer, Link, platform, VKCOM, Counter, Header,
} from '@vkontakte/vkui';

import {Backend} from "../../services/backendConnect";
import {Icon12ChevronOutline} from "@vkontakte/icons";


class Main extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			purchases: [],
			invites: []
		}

		this.openInvites = this.openInvites.bind(this)
	}

	componentDidMount() {
		Backend.callMethod('get', 'purchase/get_all').then((response) => {
			if (response !== false)
				this.setState({purchases: response})
		})

		Backend.callMethod('get', 'invites/get').then((response) => {
			if (response !== false)
				this.setState({invites: response})
		})
	}

	openInvites() {
		this.props.go('userInvites')
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

				{
					this.state.invites.length > 0 &&
						<Header
							stretched
							aside={<Link>Показать все{platform === VKCOM && <Icon12ChevronOutline/>}</Link>}
							indicator={<Counter size="s" mode="prominent">{this.state.invites.length}</Counter>}
							onClick={this.openInvites}
						>
							Приглашения
						</Header>
				}


				<PurchasesList purchases={this.state.purchases} go={this.props.go}/>
				<RichCell disabled/>

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
		switch (this.purchase.status) {
			case 'pick':
				this.props.go('purchase')
				break

			case 'bill':
				this.props.go('purchaseBill')
		}
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
