import React, {useState, useEffect, useCallback} from "react";
import {StyleSheet, Dimensions, ActivityIndicator, Alert, Platform} from "react-native";
import {Block, Text, Input, Button, theme, Toast} from "galio-framework";
import {useDispatch,useSelector} from "react-redux";
import {addAreas} from "../store/actions/worker";
import {formatTimer} from "../model/timerDate";
import MapPreview from "../components/MapPreview";
import * as Location from "expo-location";


const { width, height } = Dimensions.get('screen');

const AddArea = ({navigation, route}) =>  {
    const dispatch = useDispatch();
    const users = useSelector(state => state.worker.usersAdmin);


    const [workTitle, setWorkTitle] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const [workPlace, setWorkPlace] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [pickLocation, setPickLocation] = useState();
    const [isShow, setShow] = useState(false)
    const adminPhone = users.map(phone => phone.phone);
    const adminPhoneRev = Object.assign({},adminPhone);
    const userPikedLocation = route.params ? route.params.pickedLocation : null;

    useEffect(() => {
        if(userPikedLocation) {
            setPickLocation(userPikedLocation);
        }
    },[userPikedLocation])

    const submitHandler = async () => {

        const area = {
            phoneAdmin: adminPhoneRev["0"],
            title: workTitle,
            descriptions: descriptions,
            place: pickLocation,
            timeAdd: formatTimer
        }
        dispatch(addAreas(area))
        Alert.alert('Іноформація', `Завдання ${workTitle} добавлено`, [{text: 'Ок'}])
        setWorkTitle('')
        setDescriptions('')
        setPickLocation()
    };



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
            Alert.alert('Нет подключение', 'Повторите попытку через минуту, и повторите подключение к сети', [{text: 'Ок'}])
        }
        setIsFetching(false);
    }
    const getLocationOnMap = () => {
        navigation.navigate('MapScreen');
    }
    return (
        <Block style={styles.profileBackground} >
            <Block style={{ paddingHorizontal: 20, paddingTop: 100 }}>
                <Text color={theme.COLORS.WHITE} size={18} bold>Назва</Text>
                <Input
                    placeholder='название'
                    placeholderTextColor="#4F8EC9"
                    color={theme.COLORS.BLACK}
                    onChangeText={setWorkTitle}
                    value={workTitle}/>
                <Text color={theme.COLORS.WHITE} size={18} bold>Інформація для користувача</Text>
                <Input
                    placeholder='краткое описание'
                    placeholderTextColor="#4F8EC9"
                    color={theme.COLORS.BLACK}
                    onChangeText={setDescriptions}
                    value={descriptions}/>
                <Text color={theme.COLORS.WHITE} size={18} bold>Координати</Text>
                <Block>
                    <MapPreview style={styles.mapPreview} location={pickLocation}>
                    {isFetching ? (
                        <ActivityIndicator size="large" color={theme.COLORS.PRIMARY}/>
                        ) : (
                        <Text color={theme.COLORS.WHITE}>Виберіть локацію</Text>
                    )}
                    </MapPreview>
                </Block>
                <Block row>
                    <Button
                        style={{marginTop: 10, width: '48%', marginHorizontal: 2, elevation: 0}}
                        size="small"
                        color={theme.COLORS.GREY}
                        onPress={getLocation}
                        shadowless
                    >
                        <Text color={theme.COLORS.WHITE} bold>Мої координаты</Text>
                    </Button>
                    <Button
                        style={{marginTop: 10, width: '48%', marginHorizontal: 10, elevation: 0}}
                        size="small"
                        color={theme.COLORS.GREY}
                        onPress={getLocationOnMap}
                        shadowless
                    >
                        <Text color={theme.COLORS.WHITE} bold>Вказати точку на мапі</Text>
                    </Button>
                </Block>
            </Block>
            <Block style={{paddingHorizontal: 20, paddingVertical:15, marginBottom: Platform.OS === 'ios' ? 30 : 0}}>
                <Button
                    style={{marginTop: 2, width: '100%'}}
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
        backgroundColor: theme.COLORS.FACEBOOK,
        zIndex: -1
    },
    mapPreview: {
        width: '100%',
        height: 150,
        marginTop: 10,
        borderColor: theme.COLORS.GREY,
        borderWidth: 1
    }
});
export default AddArea;
