import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Input, Panel, PanelHeader, Cell, PanelHeaderBack, Avatar, Group} from '@vkontakte/vkui';
import './Product.css';

const Product = ({id, go,fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={go} data-to="listadmin"/>}
        >
            Информация о продукте
        </PanelHeader>
        <Div>
            <label>Название</label>
            <Input nameproduct/>
        </Div>
        <Div>
            <label>Описание</label>
            <Input description/>
        </Div>
        <Div>
            <label>Стоимость</label>
            <Input price/>
        </Div>
        <Div>
            <Button size="l" stretched onClick={go} data-to="listadmin">ДОБАВИТЬ</Button>
        </Div>
    </Panel>
);
Product.propTypes = {
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


export default Product;
