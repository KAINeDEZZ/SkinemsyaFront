import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, PanelHeaderBack, Input} from '@vkontakte/vkui';
import styles from './MainPage.module.css';
const MainPage = ({ id, go, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader>
			Скинемся
		</PanelHeader>

		<Div>
			<Input onChange={(el=this) => {jija(el)}}/>
		</Div>

		<Div className={styles.List}>
			<span>Список корзин пуст</span></Div>

			<Div className={styles.AddCartContainer}>
				<Button className={styles.BigButton} stretched size="l" mode="secondary" onClick={go} data-to="createlist">
					ДОБАВИТЬ ВКИД
				</Button>
			</Div>

	</Panel>
);

function jija(element) {
	let $input = $(element.target)[0]
    	$.get({
		url: 'https://dezz.space/',
		data: {
			find: $input.value
		},
		success: (response) => {console.log(response)},
	})
}

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
