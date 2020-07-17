import React, {useState, useEffect, useCallback} from "react";
import {
    StyleSheet,
    Dimensions, Alert
} from "react-native";
import { Block, Text, Input, Button, theme} from "galio-framework";
import {useDispatch, useSelector} from "react-redux";
import {addUser} from "../store/actions/worker";
import {formatTimer} from "../model/timerDate";
import Icon from "../components/Icon";
import {nowTheme} from "../constants";
import ModalDropdown from "react-native-modal-dropdown";

const { width, height } = Dimensions.get('screen');

const Add = ({navigation}) =>  {
    const dispatch = useDispatch();
    const users_area = useSelector(state => state.placer.usersArea);
    const users = useSelector(state => state.worker.usersAdmin);


    const adminPhone = users.map(phone => phone.phone);
    //const users_value = users_area.map(value => value.title);
    //console.log('users',users_value);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [valueInBase, setValueInBase] = useState();
    const [value, setValue] = useState('');
    const getAllPlace = async () => {
        const response = await fetch('https://work-checker-b96e4.firebaseio.com/users_area.json',
            {
                method: 'GET',
                headers: {'Context-Type': 'application/json'}
            })
        const data = await response.json();
        const allTitle = Object.keys(data).map(key => ({...data[key].users_area}))
        const onlyTitle = allTitle.map(p=>p.title);
        const r = onlyTitle;
        console.log(valueInBase, r);
        setValueInBase(r)
    }

    useEffect( ()=>{
        getAllPlace();
    },[])
    const handleOnSelect = (index, value) => {
        setValue(valueInBase[index])
    }
    const submitHandler = async () => {
        const user = {
            phoneAdmin: adminPhone,
            name: name,
            phone: phone,
            select: value,
            rol: 'сотрудник',
            location: '',
            workFlag: '0',
            timeAdd: formatTimer
        }
       dispatch(addUser(user))
        Alert.alert('Сотрудник добавлен', `Сотрудник ${name} добавлен(а), на задание ${value}`, [{text: 'Ок'}])
    };


    return (
        <Block style={styles.profileBackground} >
            <Block  style={{ paddingHorizontal: 20, paddingTop: 100}}>

                    <Text color={theme.COLORS.WHITE} size={18} bold>ФИО сотрудника</Text>
                    <Input
                      placeholder='Введите ФИО'
                      placeholderTextColor="#4F8EC9"
                      color={theme.COLORS.BLACK}
                      onChangeText={setName}/>
                    <Text color={theme.COLORS.WHITE} size={18} bold>Телефон сотрудника</Text>
                    <Input
                      placeholder='+380934666049'
                      placeholderTextColor="#4F8EC9"
                      color={theme.COLORS.BLACK}
                      onChangeText={setPhone}/>
                    <Text color={theme.COLORS.WHITE} size={18} bold>Рабочая область</Text>
                    <ModalDropdown
                        style={styles.qty}
                        onSelect={handleOnSelect}
                        options={valueInBase}
                        dropdownStyle={styles.dropdown}
                        dropdownTextStyle={{ paddingLeft: 16, fontSize: 14 }}>
                        <Block flex row middle space="between">
                            <Text size={14} style={styles.text}>
                                {value}
                            </Text>
                        </Block>
                    </ModalDropdown>

            </Block>
            <Block style={{paddingHorizontal: 20, paddingVertical:15}}>
                <Button
                    shadowless
                    style={{
                        height: 44,
                        elevation: 0 }}
                    textStyle={{ fontSize: 16 }}
                    onPress={submitHandler}
                    disabled={!name && !phone}
                    >
                    Добавить пользователя
                </Button>
            </Block>
        </Block>
    );
}

const styles = StyleSheet.create({
  profileBackground: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: theme.COLORS.FACEBOOK,
      zIndex: -1
  },
    qty: {
      height: 40,
        width: width * 0.9,
        backgroundColor: nowTheme.COLORS.WHITE,
        paddingHorizontal: 16,
        marginVertical: 10,
        paddingTop: 10,
        paddingBottom: 9.5,
        borderRadius: 4,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 1
    },
    text: {
        color: "#4F8EC9",
        fontWeight: '600'
    },
    dropdown: {
        marginTop: 8,
        marginLeft: -16,
        width: width * 0.9
    }
});
export default Add;
