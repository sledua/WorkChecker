import React from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";
import { DrawerItem as DrawerCustomItem, Icon } from "../components";
import AsyncStorage from '@react-native-community/async-storage';
const { width } = Dimensions.get("screen");

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  const screens = [
    "Profile",
    "ІНФОРМАЦІЯ",
  ];
  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block style={styles.header}>
        <Text style={styles.logo}>W</Text>
      </Block>
      <Block flex space='between' style={{paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
          <Block>
            <Block flex style={{ marginVertical: 8, paddingHorizontal: 8 }}>
              <Block
                  style={{ borderColor: 'white', width: '93%', borderWidth: StyleSheet.hairlineWidth, marginHorizontal: 10}}
              />
            </Block>
          </Block>
        <DrawerCustomItem title="ВИХІД" navigation={navigation} />
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center"
  },
  headerIcon: {
    marginTop: -20
  },
  logo: {
    fontFamily: 'montserrat-bold',
    fontSize: 25,
    color: theme.COLORS.WHITE
  }
});

export default CustomDrawerContent;
