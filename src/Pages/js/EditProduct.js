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
    Textarea, FormLayout
} from '@vkontakte/vkui';

import {Backend} from "../../services/backendConnect";


class EditProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            purchase_id: Backend.purchase_id,

            title: '',
            description: '',
            cost: '',

            errors: {}
        }

        this.back = this.back.bind(this)
    }

    componentDidMount() {
        if (Backend.product_id)
            Backend.callMethod('get', 'products/get', {
                purchase_id: Backend.purchase_id,
                product_id: Backend.product_id
            }).then(
                response => {
                    if (response !== false) {

                        this.setState({
                            title: response.title,
                            description: response.description,
                            cost: response.cost
                        })
                    }
                }
            )
    }

    handleChange(element) {
        let changer = {}
        changer[element.target.name] = element.target.value
        this.setState(changer);
    }

    submit() {
        if (this.validate()) {
            {
                let method
                let params = {
                    purchase_id: Backend.purchase_id,
                    title: this.state.title,
                    description: this.state.description,
                    cost: this.state.cost
                }

                if (Backend.product_id) {
                    method = 'products/edit'
                    params.product_id = Backend.product_id
                } else
                    method = 'products/create'

                Backend.callMethod('get', method, params).then(
                    response => {
                        if (response !== false) {
                            this.back()
                        }
                    }
                )
            }
        }
    }

    validate() {
        let errors = {}
        if (this.state.title === '')
            errors.title = 'Недопустипое значение'

        if (!(this.state.cost >= 0) || this.state.cost === '')
            errors.cost = 'Цена должна  быть положительным числом'

        this.setState({errors: errors})

        return Object.keys(errors).length === 0
    }

    back(){
        if (Backend.product_id !== undefined)
            Backend.product_id = undefined

        this.props.go('purchase')
    }

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader left={<PanelHeaderBack onClick={this.back}/>}>
                    Продукт
                </PanelHeader>

                <FormItem
                    top="Название"
                    status={this.state.errors.title ? 'error': true}
                    bottom={this.state.errors.title ? this.state.errors.title: undefined}
                >
                    <Input name={"title"} defaultValue={this.state.title} onChange={this.handleChange.bind(this)}/>
                </FormItem>

                <FormItem top="Описание">
                    <Textarea name={"description"} value={this.state.description} onChange={this.handleChange.bind(this)}/>
                </FormItem>

                <FormItem
                    top="Цена"
                    status={this.state.errors.cost ? 'error': true}
                    bottom={this.state.errors.cost ? this.state.errors.cost: undefined}
                >
                    <Input name={"cost"} value={this.state.cost} onChange={this.handleChange.bind(this)}/>
                </FormItem>

                <FormItem>
                    <Button size="l" stretched onClick={this.submit.bind(this)}>Подтвердить</Button>
                </FormItem>
            </Panel>
        )
    }
}


EditProduct.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default EditProduct;
