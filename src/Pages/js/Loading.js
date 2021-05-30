import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, ScreenSpinner} from '@vkontakte/vkui';


class Loading extends React.Component{
    constructor(props) {
        super(props);

    }
    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader>
                    Скинемся
                </PanelHeader>

                <ScreenSpinner>Auth</ScreenSpinner>
            </Panel>
        )
    }
}


Loading.propTypes = {
    id: PropTypes.string.isRequired
};


export default Loading;
