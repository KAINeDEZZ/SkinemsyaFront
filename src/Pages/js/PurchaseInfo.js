import React from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Avatar, Button,
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
    Icon28DeleteOutline, Icon28EditOutline
} from "@vkontakte/icons";
import {Backend} from "../../services/backendConnect";


class PurchaseInfo extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            popout: null
        }

        this.confirmDelete = this.confirmDelete.bind(this);
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
                <PanelHeader left={<PanelHeaderBack onClick={this.props.goNode} data-to="purchase"/>}>
                    Информация
                </PanelHeader>

                    <PurchaseConfig go={this.props.go}/>
                    <PurchaseMembers go={this.props.go}/>

                {/*{*/}
                {/*    // this.state.purchase.is_owner === 1 &&*/}
                    <Group>
                        <Header>
                            Управление вкидом
                        </Header>

                        <CellButton  before={<Icon28EditOutline/>}>
                            Редактировать
                        </CellButton>
                        <CellButton  before={<Icon28DeleteOutline/>} mode="danger" onClick={this.confirmDelete}>
                            Удалить
                        </CellButton>
                    </Group>
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
                if (response !== false) {
                    this.setState({purchase: response})
                }
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

        this.state = {
            members: []
        }

        this.goToInvite = this.goToInvite.bind(this)
    }
    componentDidMount() {
        Backend.callMethod('get', 'members/get', {purchase_id: Backend.purchase_id}).then(
            response =>  {
                if (response !== false) {
                    this.setState({members: response})
                }
                else
                    this.props.go('error')
            }
        )
    }

    goToInvite(){
        this.props.go('inviteMembers')
    }

    render() {
        return (
            <Group id={'purchaseMembers'}>
                <Header> Участники </Header>

                {
                    this.state.members.map(
                        member => <SimpleCell>{member}</SimpleCell>
                    )
                }

                {/*<SimpleCell>Иван Барышев</SimpleCell>*/}
                {/*<SimpleCell before={<Avatar src={getAvatarUrl('user_lihachyov')} />}>Михаил Лихачёв</SimpleCell>*/}
                {/*<SimpleCell before={<Avatar src={getAvatarUrl('user_arthurstam')} />}>Artur Stambultsian</SimpleCell>*/}

                <SubnavigationBar mode="fixed">
                    <SubnavigationButton before={<Icon24UserAddOutline />} size="l" onClick={this.goToInvite}>
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