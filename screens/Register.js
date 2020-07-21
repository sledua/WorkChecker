import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard, Alert
} from 'react-native';
import { Block, Checkbox, Text, theme } from 'galio-framework';
import { Button, Icon, Input } from '../components';
import { Images, nowTheme } from '../constants';
import {useDispatch, useSelector} from "react-redux";
import {runForUsers} from "../store/actions/worker";
import firebase from "../firebase";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import Constants from 'expo-constants';
const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

const Register = ({navigation}) => {

  const dispatch = useDispatch();
  const tokens = useSelector(state => state.worker.usersAdmin);
  const [inputPhone, setInputPhone] = useState(null)
  const [code, setCode] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [onlyPhone, setOnlyPhone] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [box, setBox] = useState(false)
  const [buttonColor, setButtonColor] = useState('transparent')
  const [codeLoad, setCodeLoad] = useState(false);
  console.log(code);
  const getAllPhone = async () => {
  const response = await fetch('https://work-checker-b96e4.firebaseio.com/users.json',
      {
        method: 'GET',
        headers: {'Context-Type': 'application/json'}
      })
  const data = await response.json();
  const allUsers = Object.keys(data).map(key => ({...data[key].user}))
  const rt = allUsers.map(p=>p.phone)
    setOnlyPhone(rt)
}

  useEffect( ()=>{
    getAllPhone();
  },[])

  const authInApp = async () => {
    const getFormatPhone = '+380'+inputPhone;
    const rj = onlyPhone.filter(p => p === getFormatPhone);
    console.log(typeof getFormatPhone);
    if(rj.length === 0) {
        Alert.alert('Нажаль','Нажаль ви ще не маете аккаунт, зверніться до адміністратора', [{text: 'Ok'}])
    } else {
      try{
        const phoneProvider = await new firebase.auth.PhoneAuthProvider();
        await phoneProvider.verifyPhoneNumber(getFormatPhone, recaptchaVerifier.current).then(setVerificationId);
        await dispatch(runForUsers(getFormatPhone))
        setCodeLoad(!codeLoad)

      }catch (e) {
        console.log('SMS',e)
      }
      setInputPhone(null)
    }
  }
  const confirmCode = async () => {
    if(!verificationId){
      Alert.alert('Ошибка','Сесия устарела, повторите отправке смс', [{text: 'Добре'}])
    } else {
      setIsLoading(true)
      try{
        const credential = await firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        await firebase
            .auth()
            .signInWithCredential(credential)
            .then((result) => {
              console.log(result);
            });
        navigation.navigate("App")
      }catch (e) {
        console.log('code error', e);
        setIsLoading(false);
        Alert.alert('Ошибка','Сесия устарела, повторите отправке смс', [{text: 'Добре'}])
      }

    }

  };

  return (
        <DismissKeyboard>
          <Block flex middle>
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            ><FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={Constants.manifest.extra.firebase}
              />
              <Block flex middle>
                <Block style={styles.registerContainer}>
                    <Block flex middle space="evenly">
                      <Block style={{marginTop: 30, marginBottom: -20}}>
                        <Text
                            style={{
                              fontFamily: 'montserrat-regular',
                              textAlign: 'center'
                            }}
                            color="#333"
                            size={24}
                        >Авторизація
                        </Text>
                      </Block>
                        {!codeLoad ?
                            (<Block width={width * 0.8} style={{marginBottom: -10}}>
                              <Input
                                  placeholder="Номер телефону"
                                  autoCompleteType="tel"
                                  style={styles.inputs}
                                  onChangeText={setInputPhone}
                                  value={inputPhone}
                                  keyboardType="phone-pad"
                                  textContentType="telephoneNumber"
                                  iconContent={
                                    <Icon
                                        size={16}
                                        color="#ADB5BD"
                                        name="phone"
                                        family="NowExtra"
                                        style={styles.inputIconsPhone}
                                    />
                                  }
                              />
                              <Text style={{position: 'absolute', left: 45, top: 22}}>+(380)</Text>
                            </Block>) :
                            (<Block width={width * 0.8} style={{ marginBottom: -10 }}>
                              <Input
                                  placeholder="Код з СМС"
                                  keyboardType="phone-pad"
                                  style={styles.inputs}
                                  onChangeText={setCode}
                                  value={code}
                                  iconContent={
                                    <Icon
                                        size={16}
                                        color="#ADB5BD"
                                        name="lock"
                                        family="NowExtra"
                                        style={styles.inputIcons}/>
                                  }
                              />
                            </Block>)}
                        <Block
                            row
                            middle
                            width={width * 0.8}
                            style={{marginTop: -30, marginLeft: -17}}
                        >
                          <Checkbox
                              onChange={() => {
                                setBox(!box)
                                setButtonColor('primary')
                              }}
                              checkboxStyle={{
                                borderWidth: 1,
                                borderRadius: 2,
                                borderColor: '#bbbaba'
                              }}
                              color={nowTheme.COLORS.PRIMARY}
                              labelStyle={{
                                color: nowTheme.COLORS.HEADER,
                                fontFamily: 'montserrat-regular',
                                fontSize: 10,
                              }}
                              label=""
                          />
                          <Text size={17} style={{color: theme.COLORS.MUTED,width: width * 0.65, paddingLeft: 10}}>
                            Даю згоду на використання персональних даних для ідентифікації на сервісі
                          </Text>
                        </Block>
                      <Block>
                          {!codeLoad ?(<Button
                              color={buttonColor}
                              round
                              style={styles.createButton}
                              onPress={authInApp}
                              disabled={box}>
                            <Text
                                style={{fontFamily: 'montserrat-bold'}}
                                size={14}
                                color={nowTheme.COLORS.WHITE}
                            >Відправити пароль</Text></Button>)
                            :(<Button
                                color="primary"
                                round
                                style={styles.createButton}
                                onPress={confirmCode}
                                disabled={box}>
                              <Text
                                  style={{fontFamily: 'montserrat-bold'}}
                                  size={14}
                                  color={nowTheme.COLORS.WHITE}
                              >Увійти</Text>
                            </Button>)}
                        </Block>
                      <Block>{box ? (<Text>Необхідно погодитись з правілами</Text>) : <Text style={{color: nowTheme.COLORS.WHITE}}>OO</Text>}</Block>
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
    height: height < 812 ? height * 0.6 : height * 0.5,
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
  inputIcons: {
    marginRight: 15,
    color: nowTheme.COLORS.ICON_INPUT
  },
  inputIconsPhone: {
    marginRight: 60,
    color: nowTheme.COLORS.ICON_INPUT
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  createButton: {
    width: width * 0.4,
    marginBottom: 10,
    marginTop: -30

  }
});

export default Register;
