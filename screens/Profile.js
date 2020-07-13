import React, {useState, useCallback, useEffect} from 'react';
import { FlatList, StyleSheet, Dimensions, ScrollView, Image, ImageBackground, Platform } from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { Button } from '../components';
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';
import {useSelector, useDispatch} from "react-redux";
import {updateStatus} from '../store/actions/worker';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

const Profile = ({navigation}) => {
  const users = useSelector(state => state.worker.usersAdmin);
  const dispatch = useDispatch();
  const [butn, setButn] = useState(false)

  const toggleFlag = useCallback(() => {
    console.log(users)
    dispatch(updateStatus(users.map(flag => flag.workFlag)))
  }, [dispatch])
  useEffect(() => {
    toggleFlag()
  }, [toggleFlag])
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
          <Block flex style={styles.profileCard}>
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
                    {users.map(name => name.name)}
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
                    {users.map(rol => rol.rol)}
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
                elevation: 0 }} textStyle={{ fontSize: 16 }} round
                      onPress={() => {
                        toggleFlag()
                        !butn ? setButn(true) : setButn(false)
                      }}>
                Працюю
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
              <Text size={17}>Не працюю</Text>
            </Block>
            <Block row style={{ paddingVertical: 14, paddingHorizontal: 15 }}>
              <Text bold size={17} color="#2c2c2c">
                Location:
              </Text>
              <Text size={17}>Adres</Text>
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
              elevation: 0 }}
              textStyle={{ fontSize: 16 }}
              round
              onPress={() => navigation.navigate('Add')}>
              In panel
            </Button>
          </Block>
      </Block>
    </Block>

  )
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
