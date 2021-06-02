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

const IsOwnerContext = React.createContext(undefined)

class PurchaseInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popout: null,
            is_owner: null
        }

        this.confirmDelete = this.confirmDelete.bind(this);
        this.confirmLeavePurchase = this.confirmLeavePurchase.bind(this)

        this.deletePurchase = this.deletePurchase.bind(this);
        this.leavePurchase = this.leavePurchase.bind(this)
    }

    componentDidMount() {
        Backend.callMethod('get', 'purchase/is_owner', {purchase_id: Backend.purchase_id}).then(
            response => {
                this.setState({is_owner: response.is_owner})
            }
        )
    }

    is_owner() {
        return this.state.is_owner
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
                        action: this.deletePurchase,
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
                <IsOwnerContext.Provider value={this.state.is_owner}>

                    <PanelHeader left={<PanelHeaderBack onClick={this.props.goNode} data-to="purchase"/>}>
                        Информация
                    </PanelHeader>

                    <PurchaseConfig go={this.props.go}/>
                    <PurchaseMembers go={this.props.go}/>

                    <IsOwnerContext.Consumer>
                        {is_owner => {
                            if (is_owner)
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
                                return (
                                    <Group>
                                        <Div>
                                            <Button stretched size="l" mode="destructive" onClick={this.leavePurchase}>
                                                Покинуть вкид
                                            </Button>
                                        </Div>
                                    </Group>
                                )
                        }}

                    </IsOwnerContext.Consumer>

                </IsOwnerContext.Provider>
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
                    this.state.description !== false &&
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

                <IsOwnerContext.Consumer>
                    {is_owner => (
                        is_owner === true &&
                        <InvitedUsers getUsersData={this.getUsersData} go={this.props.go}/>
                    )}
                </IsOwnerContext.Consumer>

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
                        <IsOwnerContext.Consumer>
                            { is_owner => (
                                <Cell
                                    removable={is_owner && member.id != Backend.authParams.user_id}
                                    before={<Avatar src={member.photo_50}/>}
                                    onRemove={(event, prop, id=member.id) => this.deleteMember(id)}>

                                    {member.first_name} {member.last_name}
                                </Cell>
                            )}
                        </IsOwnerContext.Consumer>
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
                    this.state.invites.map(member => <UserContainer member={member}/>)
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



// <View activePanel="button">

// </View>
//
// class Example extends React.Component {
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             popout: null,
//             actionsLog: [],
//         };
//
//         this.openAction = this.openAction.bind(this);
//         this.openDeleteion = this.openDeleteion.bind(this);
//         this.closePopout = this.closePopout.bind(this);
//         this.addActionLogItem = this.addActionLogItem.bind(this);
//     }
//
//     componentDidMount() {
//         this.openDeleteion()
//     }
//
//     addActionLogItem(value) {
//         this.setState({
//             actionsLog: [...this.state.actionsLog, value],
//         });
//     }
//
//     openAction () {
//         this.setState({ popout:
//                 <Alert
//                     actions={[{
//                         title: 'Лишить права',
//                         mode: 'destructive',
//                         autoclose: true,
//                         action: () => this.addActionLogItem('Право на модерацию контента убрано.'),
//                     }, {
//                         title: 'Отмена',
//                         autoclose: true,
//                         mode: 'cancel'
//                     }]}
//                     actionsLayout="vertical"
//                     onClose={this.closePopout}
//                     header="Подтвердите действие"
//                     text="Вы уверены, что хотите лишить пользователя права на модерацию контента?"
//                 />
//         });
//     }
//
//     openDeleteion () {
//         this.setState({ popout:
//                 <Alert
//                     actions={[{
//                         title: 'Отмена',
//                         autoclose: true,
//                         mode: 'cancel'
//                     }, {
//                         title: 'Удалить',
//                         autoclose: true,
//                         mode: 'destructive',
//                         action: () => this.addActionLogItem('Документ удален.'),
//                     }]}
//                     actionsLayout="horizontal"
//                     onClose={this.closePopout}
//                     header="Удаление документа"
//                     text="Вы уверены, что хотите удалить этот документ?"
//                 />
//         });
//     }
//
//     closePopout () {
//         this.setState({ popout: null });
//     }
//
//     render() {
//         return (
//             <View popout={this.state.popout} activePanel="alert">
//                 <Panel id="alert">
//                     <PanelHeader>Alert</PanelHeader>
//                     <Group>
//                         <CellButton onClick={this.openAction}>Лишить права</CellButton>
//                         <CellButton onClick={this.openDeleteion}>Удалить документ</CellButton>
//                         {this.state.actionsLog.map((value, i) => <Div key={i}>{value}</Div>)}
//                     </Group>
//                 </Panel>
//             </View>
//         )
//     }
// }
//
// <Example />