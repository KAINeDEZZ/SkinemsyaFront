import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Div,
    Input,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    FormItem,
    DatePicker, Textarea
} from '@vkontakte/vkui';

import {Backend} from "../../services/backendConnect";


class EditProduct extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            purchase_id: Backend.purchase_id,
            title: '',
            description: '',
            cost: '',
        };
    }

    handleChange(element) {
        let changer = {}
        changer[element.target.name] = element.target.value
        this.setState(changer);
    }

    submit(){
        if (this.validate()) {
            Backend.callMethod('post', 'create_product', this.state).then(
                response => {
                    if (response !== false) {
                        this.props.go('purchase')
                    }
                    else
                        this.props.go('error')
                }
            )
        }
    }

    validate(){
        if (this.state.title === '')
            return false

        if (isNaN(this.state.cost))
            return false

        return parseInt(this.state.cost) >= 0;


    }

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader left={<PanelHeaderBack onClick={this.props.goNode} data-to="main"/>}>
                    Продукт
                </PanelHeader>

                <Group>
                    <FormItem top="Название">
                        <Input name={"title"} defaulValue={this.state.title} onChange={this.handleChange.bind(this)}/>
                    </FormItem>

                    <FormItem top="Описание">
                        <Textarea name={"description"} defaulValue={this.state.description} onChange={this.handleChange.bind(this)}/>
                    </FormItem>

                    <FormItem top="Цена">
                        <Input name={"cost"} defaulValue={this.state.cost} onChange={this.handleChange.bind(this)}/>
                    </FormItem>

                </Group>
                <Div>
                    <Button size="l" stretched onClick={this.submit.bind(this)}>Подтвердить</Button>
                </Div>
            </Panel>
        )
    }
}


EditProduct.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default EditProduct;
