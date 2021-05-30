import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {createScopedElement} from "@vkontakte/vkui/dist/lib/jsxRuntime";

import {Backend} from "./services/backendConnect";


// import CreateList from './Pages/CreateList/CreateList';
// import List from "./Pages/ListAdmin/List";
// import Information from "./Pages/Information/Information";
// import RefactorInfo from "./Pages/RefactorInfo/RefactorInfo";
// import Product from "./Pages/AddProducts/Product";
// import ErrorPage from "./Pages/ErrorPage/ErrorPage";


import Loading from './Pages/js/Loading'
import AuthError from "./Pages/js/AuthError";
import Error from "./Pages/js/Error";
import Main from './Pages/js/Main';
import EditPurchase from "./Pages/js/EditPurchase";
import Purchase from "./Pages/js/Purchase";
import EditProduct from "./Pages/js/EditProduct";



class App extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'loading'
		}

		this.pageData = undefined

		Backend.auth().then(
			isAuth => {
				if (isAuth)
					this.go('error')

				else
					this.go('authError')
			}
		)
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
					<View activePanel={this.state.activePanel}>
						<Loading id='loading'/>
						<AuthError id='authError'/>
						<Error id='error' goNode={this.goNode}/>
						<Main id='main' go={this.go} goNode={this.goNode} purchases={this.state.purchases}/>
						<EditPurchase id='editPurchase' go={this.go} goNode={this.goNode}/>
						<Purchase id='purchase' go={this.go} goNode={this.goNode}/>
						<EditProduct id='editProduct' go={this.go} goNode={this.goNode}/>
						{/*<List id= 'listadmin' go={this.go} />*/}
						{/*<Information id= 'info' fetchedUser={fetchedUser} go={go} />*/}
						{/*<RefactorInfo id= 'refactorinfo' go={this.go} />*/}
						{/*<Product id= 'add' go={go} />*/}

					</View>
				</AppRoot>
			</AdaptivityProvider>
		)
	}
}

export default App;
