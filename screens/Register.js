import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard, Alert,
} from 'react-native';
import { Block, Checkbox, Text, theme } from 'galio-framework';
import { Button, Icon, Input } from '../components';
import { Images, nowTheme } from '../constants';
import {useDispatch} from "react-redux";
import {runForUsers} from "../store/actions/worker";

import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);
const firebaseConfig = {
  apiKey: "AIzaSyAc2265y__KIgMYtFeosl_KvDTeP92SmkY",
  authDomain: "work-checker-b96e4.firebaseapp.com",
  databaseURL: "https://work-checker-b96e4.firebaseio.com",
  projectId: "work-checker-b96e4",
  storageBucket: "work-checker-b96e4.appspot.com",
  messagingSenderId: "86335408325",
  appId: "1:86335408325:web:e48367964c3281a3ac08ac",
  measurementId: "G-PBCRZGJ2Q2"
};

const Register = ({navigation}) => {

  const dispatch = useDispatch();
  const [inputPhone, setInputPhone] = useState('')

  // firebase.initializeApp(firebaseConfig);

  const registerForPushNotifications = async () => {
    const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = status;

    if(status !== 'granted') {
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if(finalStatus !== 'granted'){return; }

    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
  }
  // useEffect(() => {
  //   registerForPushNotifications()
  // },[registerForPushNotifications])
  const authInApp = async () => {
    await dispatch(runForUsers(inputPhone))

    await navigation.navigate("App")
  }
  return (
        <DismissKeyboard>
          <Block flex middle>
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            >
              <Block flex middle>
                <Block style={styles.registerContainer}>
                  <Block flex space="evenly">
                    <Block flex={0.4} middle style={styles.socialConnect}>
                      <Block flex={0.5} middle>
                        <Text
                            style={{
                              fontFamily: 'montserrat-regular',
                              textAlign: 'center'
                            }}
                            color="#333"
                            size={24}
                        >
                          Авторизація
                        </Text>
                      </Block>

                    </Block>
                    <Block flex={1} middle space="between">
                      <Block center flex={0.9}>
                        <Block flex space="between">
                          <Block>
                            <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                              <Input
                                  placeholder="+38 097 209 56 28"
                                  type="number-pad"
                                  style={styles.inputs}
                                  onChangeText={setInputPhone}
                                  iconContent={
                                    <Icon
                                        size={16}
                                        color="#ADB5BD"
                                        name="phone"
                                        family="NowExtra"
                                        style={styles.inputIcons}
                                    />
                                  }
                              />
                            </Block>
                            <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                              <Input
                                  placeholder="Пароль"
                                  password
                                  viewPass
                                  style={styles.inputs}
                                  iconContent={
                                    <Icon
                                        size={16}
                                        color="#ADB5BD"
                                        name="lock"
                                        family="NowExtra"
                                        style={styles.inputIcons}
                                    />
                                  }
                              />
                            </Block>
                            <Block
                                style={{ marginVertical: theme.SIZES.BASE, marginLeft: 15}}
                                row
                                width={width * 0.75}
                            >
                              <Checkbox
                                  checkboxStyle={{
                                    borderWidth: 1,
                                    borderRadius: 2,
                                    borderColor: '#E3E3E3'
                                  }}
                                  color={nowTheme.COLORS.PRIMARY}
                                  labelStyle={{
                                    color: nowTheme.COLORS.HEADER,
                                    fontFamily: 'montserrat-regular',
                                    fontSize: 10,
                                  }}
                                  label="Даю згоду на використання персональних даних для ідентифікації на сервісі"
                              />
                            </Block>
                          </Block>
                          <Block center>
                            <Button
                                color="primary"
                                round
                                style={styles.createButton}
                                onPress={authInApp}>
                              <Text
                                  style={{ fontFamily: 'montserrat-bold' }}
                                  size={14}
                                  color={nowTheme.COLORS.WHITE}
                              >
                                Відправити пароль
                              </Text>
                            </Button>
                          </Block>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </ImageBackground>
          </Block>
        </DismissKeyboard>
    );
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  imageBackground: {
    width: width,
    height: height
  },
  registerContainer: {
    marginTop: 55,
    width: width * 0.9,
    height: height < 812 ? height * 0.8 : height * 0.8,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden'
  },
  socialConnect: {
    backgroundColor: nowTheme.COLORS.WHITE
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    marginHorizontal: 10
  }
});

export default Register;
