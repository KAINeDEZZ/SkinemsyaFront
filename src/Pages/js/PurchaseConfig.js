<View activePanel="info-row">
    <Panel id="info-row">
        <PanelHeader>
            InfoRow
        </PanelHeader>
        <Group>
            <SimpleCell>
                <InfoRow header="Общий бюджет">
                    3000 р.
                </InfoRow>
            </SimpleCell>
        </Group>
        <Group>
            <Header mode="secondary">Информация о пользователе</Header>
            <SimpleCell multiline>
                <InfoRow header="Дата рождения">
                    30 января 1993
                </InfoRow>
            </SimpleCell>
            <SimpleCell>
                <InfoRow header="Родной город">
                    Ереван
                </InfoRow>
            </SimpleCell>
            <SimpleCell>
                <InfoRow header="Место работы">
                    Команда ВКонтакте
                </InfoRow>
            </SimpleCell>
        </Group>
    </Panel>
</View>

<View activePanel="button">
    <Panel id="button">
        <PanelHeader>CellButton</PanelHeader>
        <Group header={<Header mode="secondary">Базовый пример</Header>}>
            <CellButton>Добавить новую школу</CellButton>
            <CellButton mode="danger">Удалить беседу</CellButton>
        </Group>
        <Group header={<Header mode="secondary">Иконки</Header>}>
            <CellButton before={<Icon28AddOutline />}>Добавить родственника</CellButton>
            <CellButton before={<Icon28DeleteOutline />} mode="danger">Удалить беседу</CellButton>
        </Group>
        <Group header={<Header mode="secondary">Аватарки</Header>}>
            <CellButton before={<Avatar shadow={false} size={40} ><Icon24Add /></Avatar>}>Добавить участников</CellButton>
            <CellButton before={<Avatar shadow={false} size={48} ><Icon28AddOutline /></Avatar>}>Создать беседу</CellButton>
            <CellButton before={<Avatar shadow={false} size={72} mode="image" ><Icon28AddOutline /></Avatar>}>Создать плейлист</CellButton>
        </Group>
        <Group header={<Header mode="secondary">Центрирование</Header>}>
            <CellButton centered before={<Icon24Add />}>Создать беседу</CellButton>
        </Group>
    </Panel>
</View>

class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popout: null,
            actionsLog: [],
        };

        this.openAction = this.openAction.bind(this);
        this.openDeleteion = this.openDeleteion.bind(this);
        this.closePopout = this.closePopout.bind(this);
        this.addActionLogItem = this.addActionLogItem.bind(this);
    }

    componentDidMount() {
        this.openDeleteion()
    }

    addActionLogItem(value) {
        this.setState({
            actionsLog: [...this.state.actionsLog, value],
        });
    }

    openAction () {
        this.setState({ popout:
                <Alert
                    actions={[{
                        title: 'Лишить права',
                        mode: 'destructive',
                        autoclose: true,
                        action: () => this.addActionLogItem('Право на модерацию контента убрано.'),
                    }, {
                        title: 'Отмена',
                        autoclose: true,
                        mode: 'cancel'
                    }]}
                    actionsLayout="vertical"
                    onClose={this.closePopout}
                    header="Подтвердите действие"
                    text="Вы уверены, что хотите лишить пользователя права на модерацию контента?"
                />
        });
    }

    openDeleteion () {
        this.setState({ popout:
                <Alert
                    actions={[{
                        title: 'Отмена',
                        autoclose: true,
                        mode: 'cancel'
                    }, {
                        title: 'Удалить',
                        autoclose: true,
                        mode: 'destructive',
                        action: () => this.addActionLogItem('Документ удален.'),
                    }]}
                    actionsLayout="horizontal"
                    onClose={this.closePopout}
                    header="Удаление документа"
                    text="Вы уверены, что хотите удалить этот документ?"
                />
        });
    }

    closePopout () {
        this.setState({ popout: null });
    }

    render() {
        return (
            <View popout={this.state.popout} activePanel="alert">
                <Panel id="alert">
                    <PanelHeader>Alert</PanelHeader>
                    <Group>
                        <CellButton onClick={this.openAction}>Лишить права</CellButton>
                        <CellButton onClick={this.openDeleteion}>Удалить документ</CellButton>
                        {this.state.actionsLog.map((value, i) => <Div key={i}>{value}</Div>)}
                    </Group>
                </Panel>
            </View>
        )
    }
}

<Example />