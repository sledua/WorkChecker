import React, {useState, useEffect, useCallback} from "react";
import {StyleSheet, Dimensions, ActivityIndicator, Alert} from "react-native";
import {Block, Text, Input, Button, theme, Toast} from "galio-framework";
import {useDispatch,useSelector} from "react-redux";
import {addPlace, addUser} from "../store/actions/worker";
import {formatTimer} from "../model/timerDate";
import MapPreview from "../components/MapPreview";
import * as Location from "expo-location";

const { width, height } = Dimensions.get('screen');

const AddArea = ({navigation, route}) =>  {
    const users = useSelector(state => state.worker.usersAdmin);
    //const dispatch = useDispatch();
    const [workTitle, setWorkTitle] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const [workPlace, setWorkPlace] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [pickLocation, setPickLocation] = useState();
    const [isShow, setShow] = useState(false)
    const adminPhone = users.map(phone => phone.phone);
    const submitHandler = async () => {
        setShow(true)
        const users_area = {
            phoneAdmin: adminPhone,
            title: workTitle,
            descriptions: descriptions,
            place: pickLocation,
            timeAdd: formatTimer
        }
        await dispatch(addPlace(users_area))
        setShow(false)
        await navigation.navigate('Profile')
    };

    const userPikedLocation = route.params ? route.params.pickedLocation : null;
    console.log('addArea', userPikedLocation)
    useEffect(() => {

        if(userPikedLocation) {
            setPickLocation(userPikedLocation);
        }
    },[])
    const getLocation = async () => {
        try {
            setIsFetching(true)
            const loc = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High})
            setPickLocation(
                {
                    lat: loc.coords.latitude,
                    lgn: loc.coords.longitude
                }
            )
        } catch (e) {
            console.log(e);
            Alert.alert('Нет подключение', 'Повторите попытку через минуту, и повторите подключение к сети', [{text: 'Добре'}])
        }
        setIsFetching(false);
    }
    const getLocationOnMap = () => {
        navigation.navigate('MapScreen');
    }
    return (
        <Block style={styles.profileBackground} >
            <Block style={{ paddingHorizontal: 20,position: 'absolute', top: width * 0.3, width: width}}>
                <Text color={theme.COLORS.WHITE} size={18} bold>Название</Text>
                <Input
                    placeholder='название'
                    placeholderTextColor="#4F8EC9"
                    color={theme.COLORS.BLACK}
                    onChangeText={setWorkTitle}/>
                <Text color={theme.COLORS.WHITE} size={18} bold>Краткое описание</Text>
                <Input
                    placeholder='краткое описание'
                    placeholderTextColor="#4F8EC9"
                    onChangeText={setDescriptions}/>
                <Text color={theme.COLORS.WHITE} size={18} bold>Координаты</Text>
                <Block>
                    <MapPreview style={styles.mapPreview} location={pickLocation}>
                    {isFetching ? (
                        <ActivityIndicator size="large" color={theme.COLORS.PRIMARY}/>
                        ) : (
                        <Text>Есть вопросы</Text>
                    )}
                    </MapPreview>

                    <Button
                        style={{marginTop: 10, width: '100%'}}
                        color={theme.COLORS.GREY}
                        onPress={getLocation}
                    >
                        <Text color={theme.COLORS.WHITE} bold>Мои координаты</Text>
                    </Button>
                    <Button
                        style={{marginTop: 10, width: '100%'}}
                        color={theme.COLORS.GREY}
                        onPress={getLocationOnMap}
                    >
                        <Text color={theme.COLORS.WHITE} bold>Указать точку на карте</Text>
                    </Button>
                </Block>
                <Button
                    style={{marginTop: height * 0.28, width: '100%'}}
                    shadowless
                    onPress={submitHandler}
                    disabled={!setWorkTitle && !setDescriptions && workPlace}>
                    Добавить</Button>
            </Block>
            <Toast isShow={isShow} positionIndicator="center" color="success">Новый сотрудник добавлен</Toast>
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
    mapPreview: {
        width: '100%',
        height: 150,
        borderColor: theme.COLORS.GREY,
        borderWidth: 1
    }
});
export default AddArea;
