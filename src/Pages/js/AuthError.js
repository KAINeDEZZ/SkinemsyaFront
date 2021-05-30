import React from 'react';
import PropTypes from 'prop-types';
import {Div, Panel, PanelHeader} from '@vkontakte/vkui';


class AuthError extends React.Component{
    constructor(props) {
        super(props);

    }
    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader>
                    Скинемся
                </PanelHeader>
                <Div>
                    <label>
                        Произошла ошибка авторизации, возможно, сервер сейчас недоступен
                    </label>
                </Div>
            </Panel>
        )
    }
}


AuthError.propTypes = {
    id: PropTypes.string.isRequired,
};


export default AuthError;
