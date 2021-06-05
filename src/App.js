import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, AdaptivityProvider, AppRoot, Alert} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {createScopedElement} from "@vkontakte/vkui/dist/lib/jsxRuntime";

import {Backend} from "./services/backendConnect";


import Loading from './Pages/js/Loading'
import AuthError from "./Pages/js/AuthError";
import Error from "./Pages/js/Error";
import Main from './Pages/js/Main';
import EditPurchase from "./Pages/js/EditPurchase";
import Purchase from "./Pages/js/Purchase";
import EditProduct from "./Pages/js/EditProduct";
import PurchaseInfo from "./Pages/js/PurchaseInfo";
import UserInvites from "./Pages/js/UserInvites";
import PurchaseBill from "./Pages/js/PurchseBill";
import UserBill from "./Pages/js/UserBill";


class App extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'loading',
			popout: null
		}

		bridge.send("VKWebAppGetAuthToken", {app_id: 7850806, scope: ''}).then(result => {
			Backend.vk_token = result.access_token
		})

		Backend.auth().then(
			isAuth => {
				if (isAuth)
					this.go('main')

				else
					this.go('authError')
			}
		)
	}

	setAlertPopout = props => {
		this.setState({
			popout: <Alert {...props}/>
		})
	}

	deletePopout = () => {
		this.setState({popout: null})
	}

	go = panel_id => {
		this.setState({activePanel: panel_id})
	}

	goNode = e => {
		this.setState({activePanel: e.currentTarget.dataset.to})
	}

	render() {
		return(
			<AdaptivityProvider>
				<AppRoot>
					<View popout={this.state.popout} activePanel={this.state.activePanel}>
						<Loading id='loading'/>
						<AuthError id='authError'/>
						<Error id='error' goNode={this.goNode}/>
						<Main id='main' go={this.go} goNode={this.goNode} purchases={this.state.purchases}/>

						<UserInvites id='userInvites' go={this.go} goNode={this.goNode}/>

						<EditPurchase id='editPurchase' go={this.go} goNode={this.goNode}/>
						<Purchase id='purchase' go={this.go} goNode={this.goNode}/>
						<PurchaseInfo id='purchaseInfo' go={this.go} goNode={this.goNode} setAlertPopout={this.setAlertPopout} deletePopout={this.deletePopout}/>

						<PurchaseBill id={'purchaseBill'}  goNode={this.goNode} go={this.go}/>
						<UserBill id='userBill' go={this.go} goNode={this.goNode}/>

						<EditProduct id='editProduct' go={this.go} goNode={this.goNode}/>
					</View>
				</AppRoot>
			</AdaptivityProvider>
		)
	}
}

export default App;

// Checklist
// todo Сделать развёрнутый просмотр данных для администратора
// todo Убрать кнопки редактирования и добавления участников в корзине статуса не пик
// todo Перенаправление страниц после пика
// todo Поработать с главной страницей
// todo Добавить редактирование

