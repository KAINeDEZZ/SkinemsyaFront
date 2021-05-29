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
import MainPage from './Pages/js/MainPage';
import AuthError from "./Pages/js/AuthError";



class App extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'loading'
		}

		this.backend = new Backend()
		this.backend.auth().then(
			isAuth => {
				if (isAuth)
					this.go('mainPage')

				else
					this.go('authError')
			}
		)
	}

	go = (panel_id) => {
		this.setState({activePanel: panel_id})
	}

	render() {
		return(
			<AdaptivityProvider>
				<AppRoot>
					<View activePanel={this.state.activePanel}>
						<Loading id='loading' go={this.go}/>
						<AuthError id='authError' go={this.go}/>
						<MainPage id='mainPage' go={this.go}/>
						{/*<CreateList id='createlist' fetchedUser={fetchedUser} go={go} go_to={go_to}/>*/}
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
