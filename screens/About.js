import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import Images from "../constants/Images";

class About extends React.Component {
  render() {
    return (
      <Block flex style={styles.container}>
        <Block flex center>
          <ImageBackground
            source={Images.Pro}
            style={{ height, width, zIndex: 1, opacity: 0.2 }}
          />
        </Block>

        <Block flex style={styles.padded}>

          <Block style={{ marginTop: -50, marginBottom: 30}}>
            <Text
              color="white"
              size={16}
              style={{ fontFamily: 'montserrat-regular' }}
            >
              About page
            </Text>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    top: 270,
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'absolute',
    bottom: theme.SIZES.BASE,
    zIndex: 2
  },
  font: {
    fontFamily: 'montserrat-bold'
  }
});

export default About;
