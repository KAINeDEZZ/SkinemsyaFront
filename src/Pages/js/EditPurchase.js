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


class EditPurchase extends React.Component{
    constructor(props) {
        super(props);
        let now = new Date()

        this.billing_limit_date = new Date(now.setDate(now.getDate() + 1))
        this.billing_limit_dict = this.date_to_dict(this.billing_limit_date)

        this.ending_limit_date = new Date(now.setDate(now.getDate() + 1))
        this.ending_limit_dict = this.date_to_dict(this.ending_limit_date)

        this.state = {
            title: '',
            description: '',
            billing_at: this.billing_limit_dict,
            ending_at: this.ending_limit_dict,

            errors: {}
        }

        this.changed = {
            title: false,
            description: false,
            billing_at: false,
            ending_at: false
        }

        this.back = this.back.bind(this)
    }

    componentDidMount() {
        if (Backend.purchase_id){
            Backend.callMethod('get', 'purchase/get', {purchase_id: Backend.purchase_id}).then(
                response => {
                    if (response !== false)
                        this.setState({
                            title: response.title,
                            description: response.description,
                            billing_at:  this.date_to_dict(new Date(response.billing_at)),
                            ending_at:  this.date_to_dict(new Date(response.ending_at))
                        })
                }
            )
        }
    }

    back(){
        if (Backend.purchase_id !== undefined)
            this.props.go('purchaseInfo')
        else
            this.props.go('main')
    }

    handleChange(element) {
        let changer = {}
        changer[element.target.name] = element.target.value
        this.changed[element.target.name] = true
        this.setState(changer);
    }

    handleChangeDate(value, name){
        let changer = {}
        changer[name] = value
        this.changed[name] = true
        this.setState(changer)
    }

    dictToISO(dict){
        let month
        if (dict.month >= 10)
            month = dict.month
        else
            month = `0${dict.month}`

        let day
        if (dict.day >= 10)
            day = dict.day
        else
            day = `0${dict.day}`

        return `${dict.year}-${month}-${day}`
    }

    submit(){
        if (this.validate()){
            let method
            let params

            if (Backend.purchase_id !== undefined) {
                method = 'purchase/edit'
                params = {purchase_id: Backend.purchase_id}

                if (this.changed.title === true)
                    params.title = this.state.title

                if (this.changed.description === true)
                    params.description = this.state.description

                if (this.changed.billing_at === true)
                    params.billing_at = this.dictToISO(this.state.billing_at)

                if (this.changed.ending_at === true)
                    params.ending_at = this.dictToISO(this.state.ending_at)
            }

            else {
                method = 'purchase/create'
                params = {
                    title: this.state.title,
                    description: this.state.description,
                    billing_at: this.dictToISO(this.state.billing_at),
                    ending_at: this.dictToISO(this.state.ending_at),
                }
            }

            Backend.callMethod('get', method, params).then(
                response => {
                    if (response !== false){
                        if (Backend.purchase_id !== undefined)
                            this.props.go('purchaseInfo')

                        else {
                            Backend.purchase_id = response.created
                            this.props.go('purchase')
                        }
                    }
                }
            )
        }
    }

    validate(){
        let errors = {}
        if (this.state.title === '')
            errors.title = 'Недопустипое значение'

        let now = new Date()
        let billing_at = this.dict_to_date(this.state.billing_at)
        let ending_at = this.dict_to_date(this.state.ending_at)

        if (now.valueOf() >= billing_at.valueOf())
            errors.billing_at = 'Дата началасбора должна быть позже текущей'

        if (billing_at.valueOf() >= ending_at.valueOf())
            errors.ending_at = 'Дата окончания сбора должна быть позже начала сбора'

        this.setState({errors: errors})
        return Object.keys(errors).length === 0
    }

    date_to_dict(date){
        return {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()}
    }

    dict_to_date(date_dict){
        return new Date(`${date_dict.year}-${date_dict.month}-${date_dict.day}`)
    }

    render() {
        console.log(this.state)
        return (
            <Panel id={this.props.id}>
                <PanelHeader left={<PanelHeaderBack onClick={this.back}/>}>
                    Вкид
                </PanelHeader>

                <Group>
                    <FormItem
                        top="Название"
                        status={this.state.errors.title ? 'error': true}
                        bottom={this.state.errors.title ? this.state.errors.title: undefined}
                    >
                        <Input name={"title"} value={this.state.title} onChange={this.handleChange.bind(this)}/>
                    </FormItem>

                    <FormItem top="Описание">
                        <Textarea name={"description"} onChange={this.handleChange.bind(this)}/>
                    </FormItem>

                    <FormItem
                        top="Дата окончания выбора"
                        status={this.state.errors.billing_at ? 'error': true}
                        bottom={this.state.errors.billing_at ? this.state.errors.billing_at: undefined}
                    >
                        <DatePicker
                            min={{day: 1, month: 1, year: 2000}}
                            max={{day: 1, month: 1, year: 2100}}
                            onDateChange={(value, name='billing_at') => this.handleChangeDate(value, name)}
                            dayPlaceholder="День"
                            monthPlaceholder="Месяц"
                            yearPlaceholder="Год"
                        />
                    </FormItem>

                    <FormItem
                        top="Дата окончания вкида"
                        status={this.state.errors.ending_at ? 'error': true}
                        bottom={this.state.errors.ending_at ? this.state.errors.ending_at: undefined}
                    >
                        <DatePicker
                            min={{day: 1, month: 1, year: 2000}}
                            max={{day: 1, month: 1, year: 2100}}
                            onDateChange={(value, name='ending_at') => this.handleChangeDate(value, name)}
                            dayPlaceholder="День"
                            monthPlaceholder="Месяц"
                            yearPlaceholder="Год"
                        />
                    </FormItem>
                </Group>
                <Div>
                    <Button size="l" stretched onClick={this.submit.bind(this)}>Подтвердить</Button>
                </Div>
            </Panel>
        )
    }
}


EditPurchase.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default EditPurchase;
