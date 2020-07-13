import React, {useState, useEffect, useCallback} from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView, ImageBackground, Dimensions
} from "react-native";
import { Block, Text, theme, Icon, Input, Button } from "galio-framework";
import {Images} from "../constants";
import Select from "../components/Select";
import {useDispatch} from "react-redux";
import {addUser} from "../store/actions/worker";

const { width, height } = Dimensions.get('screen');

const Add = props =>  {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [select, setSelect] = useState('');
    const submitHandler = useCallback(() => {
        const users = {
            id: '',
            name: name,
            phone: phone,
            select: select,
            rol: 'user',
            location: '',
            workFlagL: '0',
            timeAdd: new Date().toJSON()
        }
      dispatch(addUser(users))
    }, []);
    useEffect(() => {

    })
    return (
        <Block style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }} >
          <ImageBackground
              source={Images.ProfileBackground}
              style={styles.profileContainer}
              imageStyle={styles.profileBackground}
          >
            <Block style={{ paddingHorizontal: 20,position: 'absolute', top: width * 0.3, width: width}}>
              <Text>Name</Text>
              <Input
                  rounded
                  placeholder='Введите ФИО'
                  placeholderTextColor="#4F8EC9"
                  onChangeText={setName}/>
              <Text>Phone</Text>
              <Input
                  rounded
                  placeholder='+380934666049'
                  type="number-pad"
                  placeholderTextColor="#4F8EC9"
                  onChangeText={setPhone}/>
              <Text>Select value</Text>
              <Select
                  defaultIndex={1}
                  options={[1, 2, 3, 4, 5]}
                  style={styles.shadow}
              />
              <Button
                  color="#50C7C7"
                  shadowless
                  onPress={() => submitHandler()}>
                Добавить пользователя</Button>
            </Block>
          </ImageBackground>
        </Block>
    );
}

const styles = StyleSheet.create({
  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: -1
  },
  profileBackground: {
    width,
    height: height,
    opacity: 0.1
  },
});
export default Add;
