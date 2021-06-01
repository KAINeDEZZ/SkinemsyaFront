import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Input, Panel, PanelHeader, Cell, PanelHeaderBack, Avatar, Group} from '@vkontakte/vkui';
import './Information.css';
const Information = ({id, go,fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={go} data-to="listadmin"/>}
        >
            Информация о корзине
        </PanelHeader>
        <Div>
            <label>Название</label>
            <Input namelist/>
        </Div>
        <Div>
            <label>Ссылка на корзину</label>
            <Input link/>
        </Div>
        <Div>
            <label>Дата создания</label>
            <Input datecreate/>
        </Div>
        <Div>
            <label>Конец выбора</label>
            <Input endchange/>
        </Div>
        <Div>
            <label>Конец сбора</label>
            <Input endvkid/>
        </Div>
        {fetchedUser &&
        <Group header={<label>Список участников вкида</label>}>
            <Cell
                before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
            >
                {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
            </Cell>
        </Group>}
        <Div>
            <Button size="l" stretched style={{ marginLeft: 10 }} onClick={go} data-to="refactorinfo">РЕДАКТИРОВАТЬ</Button>
        </Div>
    </Panel>
);


Information.propTypes = {
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

export default Information;