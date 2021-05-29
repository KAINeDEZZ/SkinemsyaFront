import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Input, Panel, PanelHeader, Cell, PanelHeaderBack, Avatar, Group} from '@vkontakte/vkui';
import './CreateList.css';
import styles from "../MainPage/MainPage.module.css";
import MainPage from "../MainPage/MainPage";

const CreateList = ({id, go,fetchedUser}) => (
	<Panel id={id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={go} data-to="mainpage"/>}
		>
			Создание корзины
		</PanelHeader>
		<Div>
			<label>Название</label>
			<Input namelist/>
		</Div>
		<Div>
			<label>Конец выбора</label>
			<Input endchange/>
		</Div>
		<Div>
			<label>Конец сбора</label>
			<Input endvkid/>
		</Div>
				<Div>
					<Button size="l" stretched onClick={go} data-to="listadmin">СОЗДАТЬ</Button>
				</Div>
	</Panel>
);
CreateList.propTypes = {
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


export default CreateList;
