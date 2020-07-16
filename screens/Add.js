import React, {useState, useEffect, useCallback} from "react";
import {
  StyleSheet,
    Dimensions
} from "react-native";
import { Block, Text, Input, Button, theme} from "galio-framework";
import Select from "../components/Select";
import {useDispatch} from "react-redux";
import {addUser} from "../store/actions/worker";
import {formatTimer} from "../model/timerDate";
import Icon from "../components/Icon";
import {nowTheme} from "../constants";
import ModalDropdown from "react-native-modal-dropdown";

const { width, height } = Dimensions.get('screen');

const Add = () =>  {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [valueInBase, setValueInBase] = useState(['1Уборка в саду', '2Уборка в саду', '3Уборка в саду', '4Уборка в саду', '5Уборка в саду'])
    const [value, setValue] = useState('');

    console.log(value);
    const handleOnSelect = (index, value) => {
        setValue(valueInBase[index])
    }
    const submitHandler = () => {
        const user = {
            name: name,
            phone: phone,
            select: value,
            rol: 'сотрудник',
            location: '',
            workFlag: '0',
            timeAdd: formatTimer
        }
      dispatch(addUser(user))
    };
    return (
        <Block style={styles.profileBackground} >
            <Block style={{ paddingHorizontal: 20,position: 'absolute', top: width * 0.3, width: width}}>
                <Text color={theme.COLORS.WHITE} size={18} bold>ФИО сотрудника</Text>
                <Input
                  placeholder='Введите ФИО'
                  placeholderTextColor="#4F8EC9"
                  color={theme.COLORS.BLACK}
                  onChangeText={setName}/>
                <Text color={theme.COLORS.WHITE} size={18} bold>Телефон сотрудника</Text>
                <Input
                  placeholder='+380934666049'
                  type="number-pad"
                  placeholderTextColor="#4F8EC9"
                  color={theme.COLORS.BLACK}
                  onChangeText={setPhone}/>
                <Text color={theme.COLORS.WHITE} size={18} bold>Рабочая область</Text>
                <ModalDropdown
                    style={styles.qty}
                    onSelect={handleOnSelect}
                    options={valueInBase}
                    dropdownStyle={styles.dropdown}
                    dropdownTextStyle={{ paddingLeft: 16, fontSize: 12 }}>
                    <Block flex row middle space="between">
                        <Text size={12} style={styles.text}>
                            {value}
                        </Text>
                    </Block>
                </ModalDropdown>
                <Button
                    shadowless
                    style={{marginTop: height * 0.48, color: theme.COLORS.PRIMARY}}
                    onPress={submitHandler}
                    disabled={!name && !phone}>
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
        width: width * 0.9,
        backgroundColor: nowTheme.COLORS.DEFAULT,
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
        color: nowTheme.COLORS.WHITE,
        fontWeight: '600'
    },
    dropdown: {
        marginTop: 8,
        marginLeft: -16,
        width: width * 0.9
    }
});
export default Add;
