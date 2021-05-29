import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import {
	Panel,
	PanelHeader,
	Button,
	Div,
	Input,
} from '@vkontakte/vkui';

import styles from '../css/MainPage.module.css';


const MainPage = ({id, go}) => (
	<Panel id={id}>
		<PanelHeader>
			Скинемся
		</PanelHeader>

		<Div>
			<Input onChange={(el=this) => {jija(el)}}/>
		</Div>

		<Div>
			<PurchasesList/>
			<Purchase title="Название" description="Описание" price="Стоимость" counter="Сколько скинулись"/>
			<Purchase title="Название" description="Описание" price="Стоимость" counter="Сколько скинулись"/>
			<Purchase title="Название" description="Описание" price="Стоимость" counter="Сколько скинулись"/>
			<Purchase title="Название" description="Описание" price="Стоимость" counter="Сколько скинулись"/>
		</Div>

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


function PurchasesList(props) {
	// if (AUTH_DATA) {
	// 	console.log(AUTH_DATA)
	// 	$.get({
	// 		// async: false,
	// 		url: 'https://dezz.space/get_all_purcases/',
	// 		data: AUTH_DATA,
	// 		success: (response) => {
	// 			return response
	// 		}
	// 	})
	//
	// 	console.log()
	// }
	return (
		<Button>a</Button>
	// <List>
	// 	<Purchase/>
	// </List>
)}

function Purchase(props) {
	return (
		<Div>
			<Div>
				<label>{props.title}</label>
				<label>{props.description}</label>
			</Div>
			<Div>
				<label>{props.price}</label>
				<label>{props.counter}</label>
			</Div>
		</Div>
	)
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
