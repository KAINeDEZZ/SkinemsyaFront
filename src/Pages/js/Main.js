import React from 'react';
import PropTypes from 'prop-types';

import {
	Panel,
	PanelHeader,
	Button,
	Div,
	Input,
	List,
	RichCell,
	TooltipContainer,
	Link,
	platform,
	VKCOM,
	Counter,
	Header,
	SubnavigationButton,
	SubnavigationBar, Group,
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

				{
					this.state.invites.length > 0 &&
					<Group>
						<Header
							stretched
							aside={<Link>Показать все{platform === VKCOM && <Icon12ChevronOutline/>}</Link>}
							indicator={<Counter size="s" mode="prominent">{this.state.invites.length}</Counter>}
							onClick={this.openInvites}
						>
							Приглашения
						</Header>
					</Group>
				}

				<Group>
					<PurchasesList purchases={this.state.purchases} go={this.props.go}/>
					<RichCell disabled/>

					<TooltipContainer fixed style={{ position: 'fixed', bottom: 0, width: '100%' }}>
						<Div>
							<Button stretched size="l" onClick={this.props.goNode} data-to="editPurchase">
								Длбавить вкид
							</Button>
						</Div>
					</TooltipContainer>
				</Group>
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
		this.cellProps = {}

		switch (this.purchase.status){
			case 'pick':
				this.cellProps.after = 'Выбор'
				this.cellProps.caption = `Сбор начнётся ${this.purchase.billing_at}`
				break

			case 'bill':
				this.cellProps.after = 'Сбор'
				this.cellProps.caption = `Окончание сбора ${this.purchase.ending_at}`
				break

			case 'end':
				this.cellProps.after = 'Окончен'
				this.cellProps.caption = `Завершён ${this.purchase.ending_at}`
				break
		}
	}

	choosePurchase() {
		Backend.purchase_id = this.purchase.id
		if (this.purchase.status === 'pick')
			this.props.go('purchase')
		else if (this.purchase.is_owner)
			this.props.go('purchaseBill')
		else
			this.props.go('userBill')
	}

	render() {
		return (
			<RichCell
				onClick={this.choosePurchase.bind(this)}
				text={this.purchase.description}
				{...this.cellProps}
				// // before={
				// 	<Div>
				// 		<Div>
				// 			{this.purchase.title}
				// 		</Div>
				// 		<Div>
				// 			{this.purchase.description}
				// 		</Div>
				// 	</Div>
				// }

				// after={
				// <Div>
				// 	<Div>
				// 		{this.purchase.status}
				//
				// 	</Div>
				// 	<Div>
				// 		{this.purchase.billing_at}
				// 	</Div>
				// </Div>
				// }
			>
				{this.purchase.title}
			</RichCell>
		)
	}
}


Main.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	goNode: PropTypes.func.isRequired,
};

export default Main;
