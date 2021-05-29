import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import MainPage from './Pages/MainPage/MainPage';
import CreateList from './Pages/CreateList/CreateList';
import ListAdmin from "./Pages/ListAdmin/ListAdmin";
import Information from "./Pages/Information/Information";
import RefactorInfo from "./Pages/RefactorInfo/RefactorInfo";
import AddProducts from "./Pages/AddProducts/AddProducts";

const App = () => {
	const [activePanel, setActivePanel] = useState('mainpage');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<MainPage id='mainpage' fetchedUser={fetchedUser} go={go} />
					<CreateList id='createlist' fetchedUser={fetchedUser} go={go} />
					<ListAdmin id= 'listadmin'  go={go} />
					<Information id= 'info' fetchedUser={fetchedUser} go={go} />
					<RefactorInfo id= 'refactorinfo' go={go} />
					<AddProducts id= 'add' go={go} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
