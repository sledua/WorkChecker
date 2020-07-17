import React, {useState, useCallback, useEffect} from 'react';
import { StyleSheet, Dimensions, ImageBackground, Alert, Vibration } from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { Button } from '../components';
import { Images, nowTheme } from '../constants';
import {useSelector, useDispatch} from "react-redux";
import {updateUser} from '../store/actions/worker';
import * as Location from 'expo-location';
import {formatTimer} from "../model/timerDate";
import * as Permissions from 'expo-permissions';
import {Notifications} from "expo";
import * as firebase from "firebase";
const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

async function readPermissions() {
  const result = await Permissions.askAsync(Permissions.LOCATION)
  if(result.status !== 'granted') {
    Alert.alert('А я не поняв', 'Не разрешил использование геолокации', [{text: 'Добре'}]);
    return false;
  }
  return true;
}

const Profile = ({navigation}) => {

  const users = useSelector(state => state.worker.usersAdmin);
  const dispatch = useDispatch();

  const [pickLocation, setPickLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [butn, setButn] = useState(false)
  const [workStart, setWorkStart] = useState(null)

  const getLocation = async () => {
    const hasPermission = await readPermissions();
    if(!hasPermission)
      {
        return
      }
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
      Alert.alert('Нет подключение', 'Повторите попытку через минуту, и повторите подключение к сети', [{text: 'Добре'}])
    }
    setIsFetching(false);
  }

  const rr = users.map(f=>f.workFlag.toString())
  useEffect( () => {
    getLocation().then(r => r);
    checkStatus(rr);
    console.log( rr, butn);
  },[])
  function checkStatus(rr) {
    if (rr == 0) {
      setButn(false)
    } else {
      setButn(true)
    }
  }
  const registerForPushNotifications = async () => {
    const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = status;

    if(status !== 'granted') {
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if(finalStatus !== 'granted'){return; }

    let token = await Notifications.getExpoPushTokenAsync();
    console.log('push',token);
    const name = users.map(f=>f.id);
    await fetch(`https://work-checker-b96e4.firebaseio.com/users/${name}/user.json`,
        {method: 'PATCH',
          headers: {'Context-Type': 'application/json'},
          body: JSON.stringify({idToken: token})
        })
  }
  useEffect(() => {
    registerForPushNotifications().then(r => r)
  },[])
  const workUpdater = useCallback(() =>{

    const id = users.map(p => p.id);
    const location = pickLocation;
    const timer = {'timeStart': formatTimer}
    const rr = users.map(f=>f.workFlag)

    if(rr == 0) {
      setButn(true)
      Alert.alert('Приступая к задачи', 'Работа началась, шевелись Плотва!', [{text: 'Ok'}])
      const workFlag = '1'
      dispatch(updateUser(id, workFlag, location, timer))
    } else {
      setButn(false)
      Alert.alert('Stop', 'Bu pp', [{text: 'Ok'}])
      const workFlag = '0'
      const timer = {'timeStop': formatTimer}
      dispatch(updateUser(id, workFlag, location, timer))
    }
  },[])
  const isLoad = users.map(f=>f.rol);
  console.log(isLoad)
  if(isLoad !== 'администратор'){
    return (
        <Block style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }} >
          <Block flex={0.6} >
            <ImageBackground
                source={Images.ProfileBackground}
                style={styles.profileContainer}
                imageStyle={styles.profileBackground}
            >
              <Block flex>
                <Block style={{
                  position: 'absolute',
                  width: width,
                  zIndex: 5,
                  paddingHorizontal: 20 }}>
                  <Block style={{ top: height * 0.1 }}>
                    <Block middle >
                      <Text
                          style={{
                            fontFamily: 'montserrat-bold',
                            marginBottom: theme.SIZES.BASE / 2,
                            fontWeight: '900',
                            fontSize: 26
                          }}
                          color='#ffffff'
                      >
                        {users.map(i=>i.name)}
                      </Text>

                      <Text
                          size={16}
                          color="white"
                          style={{
                            marginTop: 5,
                            fontFamily: 'montserrat-bold',
                            lineHeight: 20,
                            fontWeight: 'bold',
                            fontSize: 18,
                            opacity: .8
                          }}
                      >
                        {users.map(r=>r.rol)}
                      </Text>
                    </Block>
                  </Block>
                </Block>
                <Block
                    middle
                    style={{ position: 'absolute', width: width, top: height * 0.3 - 22, zIndex: 99 }}
                >
                  <Button style={{
                    width: 114,
                    height: 44,
                    marginHorizontal: 5,
                    elevation: 0 }}
                          textStyle={{ fontSize: 16 }} round
                          onPress={workUpdater}
                  >
                    {butn ? 'Не працюю' : 'Працюю' }
                  </Button>
                  {butn ?
                      <Text p style={{backgroundColor: theme.COLORS.SUCCESS, color: theme.COLORS.WHITE}}>Використовуються Ваша геолокація,
                        щоб вимкнути натисніть “Не працюю”</Text> : null}
                </Block>
              </Block>
            </ImageBackground>
          </Block>
          <Block />
          <Block flex={1} style={{ padding: theme.SIZES.BASE, marginTop: 50}}>
            <Block flex style={{ marginTop: 10 }}>
              <Block row style={{ paddingVertical: 14, paddingHorizontal: 15 }}>
                <Text bold size={17} color="#2c2c2c">
                  Статус:
                </Text>
                <Text size={17}>{butn ? 'В работе' : 'Не працюю' }</Text>
              </Block>
            </Block>
          </Block>
        </Block>
    )
  } else {

    return (
        <Block style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <Block flex={0.6}>
            <ImageBackground
                source={Images.ProfileBackground}
                style={styles.profileContainer}
                imageStyle={styles.profileBackground}
            >
              <Block flex>
                <Block style={{
                  position: 'absolute',
                  width: width,
                  zIndex: 5,
                  paddingHorizontal: 20
                }}>
                  <Block style={{top: height * 0.1}}>
                    <Block middle>
                      <Text
                          style={{
                            fontFamily: 'montserrat-bold',
                            marginBottom: theme.SIZES.BASE / 2,
                            fontWeight: '900',
                            fontSize: 26
                          }}
                          color='#ffffff'
                      >
                        {users.map(i => i.name)}
                      </Text>

                      <Text
                          size={16}
                          color="white"
                          style={{
                            marginTop: 5,
                            fontFamily: 'montserrat-bold',
                            lineHeight: 20,
                            fontWeight: 'bold',
                            fontSize: 18,
                            opacity: .8
                          }}
                      >
                        {users.map(r => r.rol)}
                      </Text>
                    </Block>
                  </Block>
                </Block>
                <Block
                    middle
                    style={{position: 'absolute', width: width, top: height * 0.3 - 22, zIndex: 99}}
                >
                  <Button style={{
                    width: 114,
                    height: 44,
                    marginHorizontal: 5,
                    elevation: 0
                  }}
                          textStyle={{fontSize: 16}} round
                          onPress={workUpdater}
                  >
                    {butn ? 'Не працюю' : 'Працюю'}
                  </Button>
                  {butn ?
                      <Text p style={{backgroundColor: theme.COLORS.SUCCESS, color: theme.COLORS.WHITE}}>Використовуються
                        Ваша геолокація,
                        щоб вимкнути натисніть “Не працюю”</Text> : null}
                </Block>
              </Block>
            </ImageBackground>
          </Block>
          <Block/>
          <Block flex={1} style={{padding: theme.SIZES.BASE, marginTop: 50}}>
            <Block flex style={{marginTop: 10}}>
              <Block row style={{paddingVertical: 14, paddingHorizontal: 15}}>
                <Text bold size={17} color="#2c2c2c">
                  Статус:
                </Text>
                <Text size={17}>{butn ? 'В работе' : 'Не працюю'}</Text>
              </Block>
            </Block>
            <Block
                middle
                row
                style={{zIndex: 99}}
            >
              <Button style={{
                height: 44,
                marginHorizontal: 5,
                marginVertical: 10,
                elevation: 0
              }}
                      textStyle={{fontSize: 16}}
                      onPress={() => navigation.navigate('AddArea')}
              >
                Добавить рабочую область
              </Button>
            </Block>
            <Block
                middle
                row
                style={{zIndex: 99}}
            >
              <Button style={{
                height: 44,
                marginHorizontal: 5,
                elevation: 0
              }}
                      textStyle={{fontSize: 16}}
                      onPress={() => navigation.navigate('Add')}>
                Добавить сотрудника
              </Button>
            </Block>
          </Block>
        </Block>

    )
  }
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
    height: height * 0.3
  },

  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.5
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: 'center',
    zIndex: 99,
    marginHorizontal: 5
  }
});

export default Profile;
