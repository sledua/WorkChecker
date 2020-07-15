import React, {useState, useEffect, useCallback} from "react";
import {
    StyleSheet,
    Dimensions
} from "react-native";
import {Block, Text, Input, Button, theme} from "galio-framework";
import {useDispatch} from "react-redux";
import {addUser} from "../store/actions/worker";
import {formatTimer} from "../model/timerDate";

const { width, height } = Dimensions.get('screen');

const AddArea = () =>  {
    //const dispatch = useDispatch();
    const [workTitle, setWorkTitle] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const [workPlace, setWorkPlace] = useState('');

    const submitHandler = () => {
        const users_area = {
            title: workTitle,
            descriptions: descriptions,
            place: workPlace,
            timeAdd: formatTimer
        }
        //dispatch(addUser(users_area))
    };
    return (
        <Block style={styles.profileBackground} >
            <Block style={{ paddingHorizontal: 20,position: 'absolute', top: width * 0.3, width: width}}>
                <Text>название</Text>
                <Input
                    rounded
                    placeholder='Введите ФИО'
                    placeholderTextColor="#4F8EC9"
                    onChangeText={setWorkTitle}/>
                <Text>краткое описание</Text>
                <Input
                    rounded
                    placeholder='+380934666049'
                    type="number-pad"
                    placeholderTextColor="#4F8EC9"
                    onChangeText={setDescriptions}/>
                <Text>координаты</Text>
                <Input
                    rounded
                    placeholder='+380934666049'
                    type="number-pad"
                    placeholderTextColor="#4F8EC9"
                    onChangeText={workPlace}/>
                <Button
                    color="#50C7C7"
                    shadowless
                    onPress={submitHandler}
                    disabled={!setWorkTitle && !setDescriptions && workPlace}>
                    Добавить</Button>
            </Block>

        </Block>
    );
}

const styles = StyleSheet.create({
    profileBackground: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.COLORS.FACEBOOK
    },
});
export default AddArea;
