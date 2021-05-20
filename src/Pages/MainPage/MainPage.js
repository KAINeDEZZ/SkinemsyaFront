import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar} from '@vkontakte/vkui';
import styles from './MainPage.module.css';
const MainPage = ({ id, go, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader><span className={styles.Title}><h1>Скинемся</h1></span></PanelHeader>
						<div className={styles.Search__placeholderText}>Поиск...</div>
		<div className={styles.List}><h3>Список корзин пуст</h3></div>

			<Div>
				<Button className={styles.BigButton} stretched size="l" mode="secondary" onClick={go} data-to="persik">
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
