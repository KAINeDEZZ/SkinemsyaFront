import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Div,
    Input,
    Panel,
    PanelHeader,
    Cell,
    PanelHeaderBack,
    Avatar,
    Group,
    CellButton
} from '@vkontakte/vkui';
import './List.css';
import styles from "../MainPage/MainPage.module.css";
import MainPage from "../MainPage/MainPage";

const List = ({id, go,fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={go} data-to="mainpage"/>}
        >
            Корзина
        </PanelHeader>
        <Div>
            <Purchase title="Название"/>
            <Purchase title="Описание"/>
            <Purchase title="Стоимость"/>
            <Purchase title="Сколько скинулись"/>
        </Div>
        <Div style={{display: 'flex'}}>
           <Button size="l" stretched style={{ marginLeft: 8 }} mode='secondary' onClick={go} data-to="info">ИНФОРМАЦИЯ</Button>
            <Button size="l" stretched style={{ marginRight: 8 }} onClick={go} data-to="add">ДОБАВИТЬ</Button>
        </Div>
    </Panel>
);
List.propTypes = {
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


function Purchase(props) {
    return (<Div>
        <label>{props.title}</label>
    </Div>)
}


export default List;