import React from 'react';
import bridge from "@vkontakte/vk-bridge";
import {
    Avatar, Button, Cell,
    CellButton,
    Div,
    Group,
    Header,
    InfoRow,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell,
    SubnavigationBar,
    SubnavigationButton
} from '@vkontakte/vkui';

import {
    Icon24UserAddOutline,
    Icon28DeleteOutline,
    Icon28EditOutline
} from "@vkontakte/icons";

import {Backend} from "../../services/backendConnect";

const PurchaseContext = React.createContext({
    is_owner: false,
    status: ''
})

class PurchaseInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popout: null,
            is_owner: null,
            status: undefined
        }

        this.confirmDelete = this.confirmDelete.bind(this);
        this.confirmLeavePurchase = this.confirmLeavePurchase.bind(this)

        this.deletePurchase = this.deletePurchase.bind(this);
        this.leavePurchase = this.leavePurchase.bind(this)
        this.back = this.back.bind(this)
    }

    componentDidMount() {
        Backend.callMethod('get', 'purchase/get', {purchase_id: Backend.purchase_id}).then(
            response => {
                this.setState({is_owner: response.is_owner, status: response.status})
            }
        )
    }

    is_owner() {
        return this.state.is_owner
    }

    back(){
        if (this.state.status === 'pick')
            this.props.go('purchase')

        else
            if (this.state.is_owner)
                this.props.go('purchaseBill')
            else
                this.props.go('userBill')
    }

    confirmDelete() {
        let props = {
            actions:
                [
                    {
                        title: 'Отмена',
                        autoclose: true,
                        mode: 'cancel'
                    },
                    {
                        title: 'Удалить',
                        autoclose: true,
                        mode: 'destructive',
                        action: this.deletePurchase,
                    }
                ],
            actionsLayout: "horizontal",
            onClose: this.props.deletePopout,
            header: "Удаление документа",
            text: "Вы уверены, что хотите удалить этот вкид?",
        }

        this.props.setAlertPopout(props)
    }

    deletePurchase() {
        Backend.callMethod('get', 'purchase/delete', {purchase_id: Backend.purchase_id}).then(
            response => {
                if (response !== false) {
                    this.props.go('main')
                } else
                    this.props.go('error')
            }
        )
    }

    confirmLeavePurchase(){
        let props = {
            actions:
                [
                    {
                        title: 'Отмена',
                        autoclose: true,
                        mode: 'cancel'
                    },
                    {
                        title: 'Покинуть',
                        autoclose: true,
                        mode: 'destructive',
                        action: this.leavePurchase,
                    }
                ],
            actionsLayout: "horizontal",
            onClose: this.props.deletePopout,
            header: "Удаление документа",
            text: "Вы уверены, что хотите покинуть этот вкид?",
        }

        this.props.setAlertPopout(props)
    }

    leavePurchase(){
        Backend.callMethod('get', 'members/leave', {purchase_id: Backend.purchase_id}).then(
            response => {
                if (response !== false) {
                    this.props.go('main')
                } else
                    this.props.go('error')
            }
        )
    }

    render() {
        return (
            <Panel id={this.props.id}>
                <PurchaseContext.Provider value={{is_owner: this.state.is_owner, status: this.state.status}}>

                    <PanelHeader left={<PanelHeaderBack onClick={this.back}/>}>
                        Информация
                    </PanelHeader>

                    <PurchaseConfig go={this.props.go}/>
                    <PurchaseMembers go={this.props.go}/>

                    <PurchaseContext.Consumer>
                        {props => {
                            if (props.is_owner === true && props.status === 'pick')
                                return (
                                    <Group>
                                        <Header>
                                            Управление вкидом
                                        </Header>

                                        <CellButton before={<Icon28EditOutline/>}>
                                            Редактировать
                                        </CellButton>
                                        <CellButton before={<Icon28DeleteOutline/>} mode="danger"
                                                    onClick={this.confirmDelete}>
                                            Удалить
                                        </CellButton>
                                    </Group>
                                )

                            else
                                if (props.status  === 'pick')
                                    return (
                                        <Group>
                                            <Div>
                                                <Button stretched size="l" mode="destructive" onClick={this.confirmLeavePurchase}>
                                                    Покинуть вкид
                                                </Button>
                                            </Div>
                                        </Group>
                                    )
                        }}

                    </PurchaseContext.Consumer>
                </PurchaseContext.Provider>
            </Panel>
        )
    }
}


class PurchaseConfig extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            purchase: {}
        }
    }

    componentDidMount() {
        Backend.callMethod('get', 'purchase/get', {purchase_id: Backend.purchase_id}).then(
            response =>  {
                if (response !== false)
                    this.setState({purchase: response})

                else
                    this.props.go('error')
            }
        )
    }

    render() {
        return (
            <Group id={'purchaseConfig'}>
                <Header mode="secondary"> Основные данные </Header>

                <SimpleCell multiline>
                    <InfoRow header="Название">
                        {this.state.purchase.title}
                    </InfoRow>
                </SimpleCell>

                {
                    this.state.purchase.description !== null &&
                    <SimpleCell>
                        <InfoRow header="Описание">
                            {this.state.purchase.description}
                        </InfoRow>
                    </SimpleCell>
                }

                <SimpleCell>
                    <InfoRow header="Дата окончания выбора">
                        {this.state.purchase.billing_at}
                    </InfoRow>
                </SimpleCell>

                <SimpleCell>
                    <InfoRow header="Дата окончания вкида">
                        {this.state.purchase.ending_at}
                    </InfoRow>
                </SimpleCell>
            </Group>
        )
    }
}


class PurchaseMembers extends React.Component{
    constructor(props) {
        super(props);
        this.getUsersData = this.getUsersData.bind(this)
    }

    getUsersData(users, callback){
        try {
            bridge.send('VKWebAppCallAPIMethod', {
                method: 'users.get',
                params: {
                    user_ids: users.join(', '),
                    fields: 'photo_50',
                    v: "5.131",
                    request_id: 0,
                    access_token: Backend.vk_token
                }

            }).then(response => callback(response.response))
        }

        catch {
            this.props.go('error')
        }
    }

    render() {
        return (
            <Group>
                <Members getUsersData={this.getUsersData} go={this.props.go} is_owner={this.props.is_owner}/>

                <PurchaseContext.Consumer>
                    {props => (
                        (props.is_owner === true && props.status === 'pick') &&
                        <InvitedUsers getUsersData={this.getUsersData} go={this.props.go}/>
                    )}
                </PurchaseContext.Consumer>

            </Group>
        )
    }
}


class Members extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            members: []
        }

        this.deleteMember = this.deleteMember.bind(this)
    }

    componentDidMount() {
        Backend.callMethod('get', 'members/get', {purchase_id: Backend.purchase_id}).then(
            response => {
                if (response !== false)
                    this.props.getUsersData(response, usersData => this.setState({members: usersData})
                    )
                else
                    this.props.go('error')
            }
        )
    }

    deleteMember(target_id){
        Backend.callMethod('get', 'members/delete', {
            purchase_id: Backend.purchase_id,
            target_id: target_id

        }).then(result => {
            if (result !== false) {
                this.frontRemoveUser(target_id)
            }
        })
    }

    frontRemoveUser(target_id){
        let members = []
        for (let userData of this.state.members) {
            if (userData.id !== target_id)
                members.push(userData)
        }

        this.setState({members: members})
    }

    render() {
        return (
            <Group>
                <Header> Участники </Header>
                {
                    this.state.members.map(member =>
                        <PurchaseContext.Consumer>
                            { props => (
                                <Cell
                                    removable={props.is_owner && member.id != Backend.authParams.user_id && props.status === 'pick'}
                                    before={<Avatar src={member.photo_50}/>}
                                    onRemove={(event, prop, id=member.id) => this.deleteMember(id)}>

                                    {member.first_name} {member.last_name}
                                </Cell>
                            )}
                        </PurchaseContext.Consumer>
                    )
                }
            </Group>
        )
    }
}


class InvitedUsers extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            invites: []
        }

        this.invite = this.invite.bind(this)
    }

    componentDidMount() {
        Backend.callMethod('get', 'invites/get_purchase', {purchase_id: Backend.purchase_id}).then(
            response => {
                if (response !== false)
                    this.loadUsersData(response)
                else
                    this.props.go('error')
            }
        )
    }

    invite(){
        bridge.send('VKWebAppGetFriends', {multi: true}).then(
            response => {
                if (response) {
                    Backend.callMethod('get', 'invites/create_row', {
                        purchase_id: Backend.purchase_id,
                        targets_ids: this.getIdListId(response.users).join(', ')

                    }).then(result => {
                        if (result !== false) {
                            this.loadUsersData(result)
                        }
                    })
                }
            }
        )
    }

    loadUsersData(usersIds){
        this.props.getUsersData(usersIds, userData => {
            let invites = this.state.invites
            invites.push.apply(invites, userData)
            this.setState({invites: invites})
        })
    }

    getIdListId(udersData){
        return udersData.map(userData => userData.id)
    }

    deleteInvite(target_id){
        Backend.callMethod('get', 'invites/delete', {
            purchase_id: Backend.purchase_id,
            target_id: target_id

        }).then(result => {
            if (result !== false) {
                this.frontRemoveUser(target_id)
            }
        })
    }

    frontRemoveUser(target_id){
        let invites = []
        for (let userData of this.state.invites) {
            if (userData.id !== target_id)
                invites.push(userData)
        }

        this.setState({invites: invites})
    }

    render() {
        return (
            <Group>
                {
                    this.state.invites.length > 0 &&
                    <Header> Приглашённые участники </Header>
                }

                {
                    this.state.invites.map(member => (
                            <Cell id={member.id} removable before={<Avatar src={member.photo_50}/>} onRemove={(event, prop, id=member.id) => this.deleteInvite(id)}>
                                {member.first_name} {member.last_name}
                            </Cell>
                        )
                    )
                }

                <SubnavigationBar mode="fixed">
                    <SubnavigationButton before={<Icon24UserAddOutline/>} size="l" onClick={this.invite}>
                        Добавить участника
                    </SubnavigationButton>
                </SubnavigationBar>
            </Group>
        )
    }
}


export default PurchaseInfo
