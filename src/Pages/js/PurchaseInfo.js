import React from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Avatar, Button, Cell,
    CellButton,
    Div,
    Group,
    Header,
    InfoRow,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell, SubnavigationBar, SubnavigationButton, View
} from '@vkontakte/vkui';

import {
    Icon24Add,
    Icon24ScanViewfinderOutline,
    Icon24UserAddOutline,
    Icon28AddOutline,
    Icon28DeleteOutline,
    Icon28EditOutline
} from "@vkontakte/icons";

import {Backend} from "../../services/backendConnect";

import bridge from "@vkontakte/vk-bridge";
import InviteMembers from "./InviteMembers";

const IsOwnerContext = React.createContext(undefined)

class PurchaseInfo extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            popout: null,
            is_owner: null
        }

        // this.context = {
        //     is_owner: IsOwner
        // }

        this.confirmDelete = this.confirmDelete.bind(this);
        this.is_owner = this.is_owner.bind(this)
    }

    componentDidMount() {
        Backend.callMethod('get', 'purchase/is_owner', {purchase_id: Backend.purchase_id}).then(
            response =>  {this.setState({is_owner: response.is_admin})}
        )
        // this.is_owner(is_owner => ))
    }

    is_owner(){
        return this.state.is_owner
    }

    confirmDelete () {
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
                        action: () => this.deletePurchase(),
                    }
                ],
            actionsLayout: "horizontal",
            onClose: this.props.deletePopout,
            header: "Удаление документа",
            text: "Вы уверены, что хотите удалить этот документ?",
        }

        this.props.setAlertPopout(props)
    }

    deletePurchase(){
        Backend.callMethod('get', 'purchase/delete', {purchase_id: Backend.purchase_id}).then(
            response =>  {
                if (response !== false) {
                    this.props.go('main')
                }
                else
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
                        {is_owner => (
                            is_owner === true &&
                            <Group>
                                <Header>
                                    Управление вкидом
                                </Header>

                                <CellButton before={<Icon28EditOutline/>}>
                                    Редактировать
                                </CellButton>
                                <CellButton before={<Icon28DeleteOutline/>} mode="danger" onClick={this.confirmDelete}>
                                    Удалить
                                </CellButton>
                            </Group>
                        )}

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
                    this.state.description &&
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

        this.deleteMember = this.deleteMember.bind()
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

    deleteMember(element){
        let args = {
            purchase_id: Backend.purchase_id,
            target_id: element.target.id
        }

        // Backend.callMethod('get', 'members/delete', args).then(
        //     response => {
        //         if (response !== false)
        //             bridge.send('VKWebAppCallAPIMethod', {
        //                 method: 'users.get',
        //                 params: {
        //                     user_ids: users,
        //                     fields: 'photo_50',
        //                     v: "5.131",
        //                     request_id: 0,
        //                     access_token: Backend.vk_token
        //                 }
        //
        //             }).then(response => this.setState({members: response}))
        //             // this.props.getUsersData(response, usersData => ))
        //         else
        //             this.props.go('error')

            // }
        // )
    }

    render() {
        return (
            <Group>
                <Header> Участники </Header>
                {
                    this.state.members.map(
                        member => <Cell id={member.id} removable before={<Avatar
                            src={member.photo_50}/>}>{member.first_name}{member.last_name}</Cell>
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
                    this.props.getUsersData(response, usersData => this.setState({invites: usersData}))
                else
                    this.props.go('error')
            }
        )
    }

    invite(){
        bridge.send('VKWebAppGetFriends', {multi: true}).then(
            response => {
                if (response) {
                    response.users.map(user => {
                        Backend.callMethod('get', 'invites/create', {
                            purchase_id: Backend.purchase_id,
                            target_id: user.id

                        }).then(result => {
                            if (result !== false) {
                                // let invites = this.state.invites
                                // invites.push(result)
                                // this.setState({invites: invites.push(result.id)})
                            }
                        })
                    })
                }
            }
        )
    }

    deleteInvite(element){
        let params = {
            purchase_id: Backend.purchase_id,
            target_id: element.target.id
        }
        Backend.callMethod('get', 'invites/delete', params).then(response => {

        })
    }

    render() {
        return (
            <Group>
                <Header> Приглашённые участники </Header>
                {
                    this.state.invites.map(member => (
                            <Cell id={member.id} removable before={<Avatar src={member.photo_50}/>} onRemove={this.deleteInvite}>
                                {member.first_name}{member.last_name}
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