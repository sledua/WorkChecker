import React, {useEffect, useState} from "react";
import {Alert, Dimensions, StyleSheet, Platform} from "react-native";
import {Block, Button, Input, Text, theme} from "galio-framework";
import {useDispatch, useSelector} from "react-redux";
import {addPlace, addUser} from "../store/actions/worker";
import {formatTimer} from "../model/timerDate";
import {nowTheme} from "../constants";
import ModalDropdown from "react-native-modal-dropdown";


const { width, height } = Dimensions.get('screen');

const Add = ({navigation}) =>  {
    const dispatch = useDispatch();
    const users = useSelector(state => state.worker.usersAdmin);

    const [valueInBase, setValueInBase] = useState([]);
    const [value, setValue] = useState('');
    const [idSelectItem, setIdSelectItem] = useState([]);
    const [ids, setIds] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');


    const adminPhone = users.map(phone => phone.phone);
    const adminPhoneRev = Object.assign({},adminPhone);

    const getAllPlace = async () => {
        const response = await fetch('https://work-checker-b96e4.firebaseio.com/area.json',
            {
                method: 'GET',
                headers: {'Context-Type': 'application/json'}
            })
        const data = await response.json();
        const allTitle = Object.keys(data).map(key => ({...data[key].area}))
        const onlyTitle = allTitle.map(p=>p.title);
        const onlyId = allTitle.map(id=>id.id)
        setValueInBase(onlyTitle)
        setIdSelectItem(onlyId);
        setValue(onlyTitle[0])

    }
    useEffect( ()=>{
        getAllPlace();

    },[])
    const handleOnSelect = (index, value) => {
        setValue(valueInBase[index]);
        setIds(idSelectItem[index]);
    }
    const submitHandler = async () => {
        const user = {
            phoneAdmin: adminPhoneRev["0"],
            name: name,
            phone: phone,
            select: value,
            rol: 'співробітник',
            workFlag: '0',
            timeAdd: formatTimer
        }
        const response = await fetch('https://work-checker-b96e4.firebaseio.com/area.json',
            {
                method: 'GET',
                headers: {'Context-Type': 'application/json'}
            })
        const data = await response.json();
        const carentArea = Object.keys(data).map(key => ({...data[key].area}))
        const discrArea = carentArea.filter(id => id.id === ids)
        const discr = discrArea.map(d=>d.descriptions)
        const discrRev = Object.assign({},discr);
        const maps = discrArea.map(d=>d.place)
        const mapsRev = Object.assign({},maps);
        const users_area = {
            name: name,
            phone: phone,
            rol: 'співробітник',
            phoneAdmin: adminPhoneRev["0"],
            title: value,
            descriptions:  discrRev["0"],
            place: mapsRev["0"],
            timeAdd: formatTimer
        }
        dispatch(addUser(user))
        dispatch(addPlace(users_area) )

        setName('')
        setPhone('')
        Alert.alert('Інформація', `Співробітник ${name} добавлений(а), на завдання ${value}`, [{text: 'Ок'}]);
    };


    return (
        <Block style={styles.profileBackground} >
            <Block  style={{ paddingHorizontal: 20, paddingTop: 100, flex: 1}}>
                <Text color={theme.COLORS.WHITE} size={18} bold>ФІО співробітника</Text>
                <Input
                  placeholder='Введите ФИО'
                  placeholderTextColor="#4F8EC9"
                  color={theme.COLORS.BLACK}
                  onChangeText={setName}
                  value={name}/>
                <Text color={theme.COLORS.WHITE} size={18} bold>Телефон співробітника</Text>
                <Input
                  placeholder='+380934666049'
                  placeholderTextColor="#4F8EC9"
                  color={theme.COLORS.BLACK}
                  onChangeText={setPhone}
                  value={phone}/>
                <Text color={theme.COLORS.WHITE} size={18} bold >Виберіть завдання</Text>
                <ModalDropdown
                    style={styles.qty}
                    onSelect={handleOnSelect}
                    options={valueInBase}
                    dropdownStyle={styles.dropdown}
                    dropdownTextStyle={{ paddingLeft: 16, fontSize: 14 }}>
                    <Block >
                        <Text size={14} style={styles.text}>
                            {value}
                        </Text>
                    </Block>
                </ModalDropdown>
            </Block>
            <Block style={{paddingHorizontal: 20, paddingVertical:15, marginBottom: Platform.OS === 'ios' ? 30 : 0 }}>
                <Button
                    shadowless
                    style={{marginTop: 2, width: '100%'}}
                    textStyle={{ fontSize: 16 }}
                    onPress={submitHandler}
                    disabled={!name && !phone}
                    >
                    Додати співробітника
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

  },
    qty: {
        width: width * 0.9,
        height: 40,
        backgroundColor: nowTheme.COLORS.WHITE,
        paddingHorizontal: 16,
        marginVertical: 10,
        paddingTop: 10,
        paddingBottom: 9.5,
        borderRadius: 5,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 1,

    },
    text: {
        color: "#4F8EC9",
        fontWeight: '600',
        paddingVertical: 1
    },
    dropdown: {
        marginTop: 8,
        marginLeft: -16,
        width: width * 0.9,

    }
});
export default Add;
