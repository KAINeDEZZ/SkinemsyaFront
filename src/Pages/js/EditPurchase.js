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

        this.ending_limit_date = new Date(now.setDate(now.getDate() + 2).valueOf())
        this.ending_limit_dict = this.date_to_dict(this.ending_limit_date)

        this.state = {
            title: '',
            description: '',
            billing_at: this.billing_limit_dict,
            ending_at: this.ending_limit_dict
        };
    }

    handleChange(element) {
        let changer = {}
        changer[element.target.name] = element.target.value
        this.setState(changer);
    }

    submit(){
        if (this.validate()){
            this.props.go('loading')
            let args = Object.assign({}, this.state)

            args['billing_at'] = `${this.state.billing_at.year}-${this.state.billing_at.month}-${this.state.billing_at.day}T00:00`
            args['ending_at'] = `${this.state.ending_at.year}-${this.state.ending_at.month}-${this.state.ending_at.day}T00:00`

            Backend.callMethod('get', 'create_purchase', args).then(
                response => {
                    if (response){
                        Backend.purchase_id = response.id
                        this.props.go('purchase')
                    }
                }
            )
        }
    }

    validate(){
        console.log(this.state)
        if (this.state.title  === '')
            return false

        let now = new Date()
        let billing_at = this.dict_to_date(this.state.billing_at)
        let ending_at = this.dict_to_date(this.state.ending_at)

        console.log(now.valueOf(), billing_at.valueOf(), ending_at.valueOf())

        return !(now.valueOf() > billing_at.valueOf() || billing_at.valueOf() > ending_at.valueOf());


    }

    date_to_dict(date){
        return {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()}
    }

    dict_to_date(date_dict){
        return new Date(`${date_dict.year}-${date_dict.month}-${date_dict.day}`)
    }

    render() {



        return (
            <Panel id={this.props.id}>
                <PanelHeader left={<PanelHeaderBack onClick={this.props.goNode} data-to="main"/>}>
                    Создание вкида
                </PanelHeader>

                <Group>
                    <FormItem top="Название">
                        <Input name={"title"} onChange={this.handleChange.bind(this)}/>
                    </FormItem>

                    <FormItem top="Описание">
                        <Textarea name={"description"} onChange={this.handleChange.bind(this)}/>
                    </FormItem>

                    <FormItem top="Дата окончания выбора">
                        <DatePicker
                            min={this.billing_limit_dict}
                            max={{day: 1, month: 1, year: 2100}}
                            defaultValue={this.state.billing_at}
                            onDateChange={(value) => {this.setState({billing_at: value})}}
                            dayPlaceholder="День"
                            monthPlaceholder="Месяц"
                            yearPlaceholder="Год"
                            name={'billing_at'}
                        />
                    </FormItem>
                    <FormItem top="Дата окончания вкида">
                        <DatePicker
                            min={this.ending_limit_dict}
                            max={{day: 1, month: 1, year: 2100}}
                            defaultValue={this.ending_limit_dict}
                            onChange={(value) => {this.setState({ending_at: value})}}
                            dayPlaceholder="День"
                            monthPlaceholder="Месяц"
                            yearPlaceholder="Год"
                            name={'ending_at'}
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
