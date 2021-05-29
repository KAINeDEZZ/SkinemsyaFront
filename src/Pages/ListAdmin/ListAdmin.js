import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Input, Panel, PanelHeader, Cell, PanelHeaderBack, Avatar, Group} from '@vkontakte/vkui';
import './ListAdmin.css';
import styles from "../MainPage/MainPage.module.css";
import MainPage from "../MainPage/MainPage";

const ListAdmin = ({id, go,fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={go} data-to="mainpage"/>}
        >
            Корзина
        </PanelHeader>
        {fetchedUser &&
        <Group header={<label>Список участников вкида</label>}>
            <Cell
                before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
            >
                description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
                {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
            </Cell>
        </Group>}
        <Div style={{display: 'flex'}}>
           <Button size="l" stretched style={{ marginLeft: 8 }} mode='secondary' onClick={go} data-to="info">ИНФОРМАЦИЯ</Button>
            <Button size="l" stretched style={{ marginRight: 8 }} onClick={go} data-to="add">ДОБАВИТЬ</Button>
        </Div>
    </Panel>
);
ListAdmin.propTypes = {
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


export default ListAdmin;