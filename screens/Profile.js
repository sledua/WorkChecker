import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
    View
} from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { Button } from '../components';
import { Images, nowTheme } from '../constants';
import {useSelector, useDispatch} from "react-redux";
import {updateUser} from '../store/actions/worker';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {formatTimer} from "../model/timerDate";
import * as Permissions from 'expo-permissions';
import {Notifications} from "expo";
import * as firebase from "firebase";
import {LOCATION} from "expo-permissions";
const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
const MY_LOCATION = 'My_location';
async function readPermissions() {
  const result = await Permissions.askAsync(Permissions.LOCATION)
  if(result.status !== 'granted') {
    Alert.alert('А я не поняв', 'Не разрешил использование геолокации', [{text: 'Добре'}]);
    return false;
  }
  return true;
}
const Profile = ({navigation}) => {
  TaskManager.defineTask(MY_LOCATION, async ({ data, error }) => {
    if (error) {
      return;
    }
    if (data) {
      const {locations} = data;
      const name = users.map(f => f.id);
      console.log('Received new locations', locations);
      await fetch(`https://work-checker-b96e4.firebaseio.com/users/${name}/user.json`,
          {
            method: 'PATCH',
            headers: {'Context-Type': 'application/json'},
            body: JSON.stringify({bgLocations: locations})
          }
      )
    }
  });

  const users = useSelector(state => state.worker.usersAdmin);
  const dispatch = useDispatch();

  const [pickLocation, setPickLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [butn, setButn] = useState(false);
  const [ust, setUst] = useState();
  const rt = users.filter(p=>p.rol.toString() === 'сотрудник')
  const [onlyArea, setOnlyArea] = useState([]);
  const getAllArea = async () => {
    setIsFetching(true)
    const response = await fetch('https://work-checker-b96e4.firebaseio.com/users_area.json',
        {
          method: 'GET',
          headers: {'Context-Type': 'application/json'}
        })
    const data = await response.json();
    const allArea = Object.keys(data).map(key => ({...data[key].users_area}))
    const myAdminSelect = users.map(phone=>phone.phoneAdmin.toString())
    const adminSelect = allArea.filter(p=>p.phoneAdmin !== myAdminSelect)
    setOnlyArea(adminSelect)
    setIsFetching(true)
  }
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
      Alert.alert('Виникли питання', 'Не переймайтесь, всі данні записано', [{text: 'Добре'}])
    }
    setIsFetching(false);
  }

  console.log(onlyArea);

  const bgLocationStart = async () => {
    await Location.startLocationUpdatesAsync(MY_LOCATION, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 360000,
      pausesUpdatesAutomatically: true,
      activityType: Location.ActivityType.AutomotiveNavigation,
      showsBackgroundLocationIndicator: true,
    })
  }
  const bgLocationStop = async () => {
    await Location.stopLocationUpdatesAsync(MY_LOCATION)
  }

  useEffect(()=>{
    getAllArea();
  },[])
  useEffect(()=>{

    getLocation();
    if(rt.length === 0) {
      setUst(true)
    } else {
      setUst(false)
    }
    registerForPushNotifications();

    const rr = users.map(f=>f.workFlag);
    if (rr == 0) {
      setButn(false);

    } else {
      setButn(true);
      bgLocationStop();
    }
  },[])


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

  const workUpdater = useCallback(() =>{

    const id = users.map(p => p.id);
    const location = pickLocation;
    const timer = {'timeStart': formatTimer}
    const rr = users.map(f=>f.workFlag.toString())

    if(rr == 0) {
      setButn(true)
      Alert.alert('Інформація', 'Передача данних почалась', [{text: 'Ok'}])
      const workFlag = '1'
      bgLocationStart().then(r => r);
      dispatch(updateUser(id, workFlag, location, timer))
    } else {
      setButn(false)
      Alert.alert('Інформація', 'Дякую', [{text: 'Ok'}]);
      bgLocationStop().then(r => r);
      const workFlag = '0'
      const timer = {'timeStop': formatTimer}
      dispatch(updateUser(id, workFlag, location, timer))
    }
  },[])


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
                          }}
                      >
                        {users.map(r => r.rol)}
                      </Text>
                    </Block>
                  </Block>
                </Block>
                <Block
                    middle
                    style={{position: 'absolute', width: width, top: height * 0.3 - 22, zIndex: 99, }}
                >
                  <Button style={{
                    width: 114,
                    height: 44,
                    paddingHorizontal: 5,
                    elevation: 0
                  }}
                          textStyle={{fontSize: 16}} round
                          onPress={workUpdater}
                  >
                    {butn ? 'Не працюю' : 'Працюю'}
                  </Button>
                  {butn ?
                      (<Block style={{height: 90}}>
                      <Text style={{backgroundColor: theme.COLORS.SUCCESS, color: theme.COLORS.WHITE, zIndex: 100, height: 150}} bold size={18}>Використовуються
                        Ваша геолокація,
                        щоб вимкнути натисніть “Не працюю”</Text></Block>) : null}
                </Block>
              </Block>
            </ImageBackground>
          </Block>
          <Block/>
          <Block flex={1} style={{padding: theme.SIZES.BASE, marginTop: 50, backgroundColor: theme.COLORS.FACEBOOK}}>
            <Block flex style={{marginTop: 10}}>
              <Block  style={{paddingVertical: 14, paddingHorizontal: 15}}>
                <Text bold size={18} color={theme.COLORS.WHITE}>
                  Статус:
                </Text>
                <Text size={17} color={theme.COLORS.WHITE}>{butn ? 'В работе' : 'Не працюю'}</Text>
              </Block>
            </Block>
            <Block flex={6} style={{zIndex: 99, paddingHorizontal: 15, }}>
              {isFetching ?(<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color={theme.COLORS.PRIMARY}/></View>):(<FlatList
                  data={onlyArea}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) =>
                      <Block style={{paddingVertical: 5}}>
                        <Text bold size={18} color={theme.COLORS.WHITE}
                              style={{fontFamily: 'montserrat-bold',}}>Завдання</Text>
                        <Text size={16} color={theme.COLORS.WHITE}>{item.title}</Text>
                        <Text bold size={18} color={theme.COLORS.WHITE}
                              style={{fontFamily: 'montserrat-bold',}}>Опис</Text>
                        <Text size={16} color={theme.COLORS.WHITE}>{item.descriptions}</Text>
                      </Block>
                  }
              />)}
            </Block>
            {ust ? (<Block middle row style={{zIndex: 99}}>
              <Button style={{height: 44, marginHorizontal: 5, marginVertical: 10, elevation: 0}}
                      textStyle={{fontSize: 16}}
                      onPress={() => navigation.navigate('AddArea')}>
                Додати завдання
              </Button>
              </Block>) : null}
            {ust ? (<Block middle row style={{zIndex: 99}}>
              <Button style={{height: 44,
              marginHorizontal: 5,
              elevation: 0
            }}
              textStyle={{fontSize: 16}}
              onPress={() => navigation.navigate('Add')}>
              Додати співробітника
              </Button>
              </Block>) : null}
          </Block>
        </Block>

    )

}
const styles = StyleSheet.create({

  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: -1,
    backgroundColor: theme.COLORS.FACEBOOK
  },
  profileBackground: {
    width,
    height: height * 0.3,
    backgroundColor: theme.COLORS.FACEBOOK
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


