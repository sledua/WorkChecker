import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions, Platform } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import AsyncStorage from '@react-native-community/async-storage';
const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants/';
import { HeaderHeight } from '../constants/utils';
import {useDispatch} from "react-redux";
import {authInto} from "../store/actions/worker";

const Onboarding = ({navigation}) => {
  const dispatch = useDispatch();
      const roadMap = async () => {
        try {
          const userData = await AsyncStorage.getItem('user');
          if(!userData) {
            navigation.navigate('Account')
            return ;
          }
          const transform = JSON.parse(userData);
          const {token, inputPhone} = transform;
          await dispatch(authInto(token, inputPhone))
          console.log(token, inputPhone);
        } catch (e) {
          console.log('Title error',e)
        }
        navigation.navigate("App")

      }


    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex>
          <ImageBackground
            source={Images.Onboarding}
            style={{ flex: 1, height: height, width, zIndex: 1 }}
          />
          <Block center style={styles.padded}>
            <Block>
              <Block middle>
                <Text style={{ fontFamily: 'montserrat-bold',fontSize: 80,color: theme.COLORS.WHITE,bottom: 400, position: 'absolute' }}>W</Text>
              </Block>
              <Block>
                <Block middle>
                  <Text
                    style={{
                      fontFamily: 'montserrat-regular', bottom: 200, position: 'absolute', letterSpacing: 1, paddingHorizontal: 10, textAlign: 'center'
                    }}
                    color="white"
                    size={42}
                  >
                    Work Checker Work remotely
                  </Text>
                </Block>
              </Block>
              <Block
                style={{
                  marginTop: theme.SIZES.BASE * 1.5,
                  marginBottom: theme.SIZES.BASE * 2
                }}
              >
                <Button
                  shadowless
                  style={styles.button}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => roadMap()}
                >
                  <Text
                    style={{ fontFamily: 'montserrat-bold', fontSize: 14 }}
                    color={theme.COLORS.WHITE}
                  >
                     Начать работу
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },

  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66
  }
});
export default Onboarding;
