import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar} from '@vkontakte/vkui';
import styles from './MainPage.module.css';
const MainPage = ({ id, go, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader><span className={styles.Title}>Скинемся</span></PanelHeader>
		<Header><span className={styles.List}>Список корзин</span></Header>
		<Header mode="secondary">Список корзин пуст</Header>

			<Div>
				<Button  stretched size="l" mode="secondary" onClick={go} data-to="persik">
					ДОБАВИТЬ ВКИД
				</Button>
			</Div>

	</Panel>
);

MainPage.propTypes = {
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

export default MainPage;
