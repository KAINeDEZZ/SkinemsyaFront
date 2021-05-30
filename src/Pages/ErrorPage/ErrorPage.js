import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Input, Panel, PanelHeader, Cell, PanelHeaderBack, Avatar, Group} from '@vkontakte/vkui';
import './ErrorPage.css';
import Main from "../js/Main";



const ErrorPage = ({id, go,fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader left={<Main onClick={go} data-to="listadmin"/>}>
            Информация о корзине
        </PanelHeader>
        <Div>
            <label>
                Что-то пошло не так
            </label>
        </Div>
    </Panel>
);


ErrorPage.propTypes = {
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

export default ErrorPage;