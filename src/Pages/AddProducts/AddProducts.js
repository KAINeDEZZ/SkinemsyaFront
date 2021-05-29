import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Input, Panel, PanelHeader, Cell, PanelHeaderBack, Avatar, Group} from '@vkontakte/vkui';
import './AddProducts.css';

const AddProducts = ({id, go,fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={go} data-to="listadmin"/>}
        >
            Список
        </PanelHeader>
        <Div>
            <Button size="l" stretched style={{ marginLeft: 10 }}onClick={go} data-to="listadmin">СОЗДАТЬ</Button>
        </Div>
    </Panel>
);
AddProducts.propTypes = {
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


export default AddProducts;
