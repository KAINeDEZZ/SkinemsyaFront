import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Panel, PanelHeader, PanelHeaderBack} from '@vkontakte/vkui';


class AuthError extends React.Component{
    constructor(props) {
        super(props);

    }
    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={this.props.goNode} data-to="main"/>}
                >
                    Скинемся
                </PanelHeader>
                <Div>
                    <label>
                        Произошла ошибка запроса на сервер, возможно, сервер сейчас недоступен
                    </label>
                </Div>
                <Div>
                    <label>
                        {'  Возможно, сервер сейчас недоступен'}
                    </label>
                </Div>
                <Div>
                    <label>
                        {'      Но скорее всего кодер долбаёб'}
                    </label>
                </Div>
                <Button>asd</Button>
            </Panel>
        )
    }
}


AuthError.propTypes = {
    id: PropTypes.string.isRequired,
    goNode: PropTypes.func.isRequired
};


export default AuthError;
