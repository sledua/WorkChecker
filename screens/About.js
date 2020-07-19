import React from "react";
import {StyleSheet} from "react-native";
import { Block, Text, theme } from "galio-framework";

class About extends React.Component {
  render() {
    return (
      <Block flex style={styles.container}>
        <Block flex style={styles.padded}>
          <Block center>
            <Text
              color="white"
              bold
              h5
              style={{ fontFamily: 'montserrat-regular' }}
            >
              Інформація для користувача
            </Text>
            <Text color="white"
                  bold h5>Інформаційний додаток Work Checker</Text>
          </Block>
          <Block style={{paddingHorizontal: 20}}>
            <Text color="white"
                  bold center style={{paddingTop: 50, paddingBottom: 5, fontFamily: 'montserrat-bold'}}>Для адміністратора</Text>
            <Text color="white" size={16} style={{paddingTop: 10, paddingBottom: 5}}>Щоб розпочаті роботу необхідно натиснути працюю</Text>
            <Text color="white" size={16} style={{paddingTop: 10, paddingBottom: 5}}>Для того щоб додати завдання небхідно перейти у відповідний розділ, і заповнити всі поля</Text>
            <Text color="white" size={16} style={{paddingTop: 10}}>Для того щоб додати виконавця небхідно перейти у відповідний розділ, і заповнити всі поля</Text>
          </Block>
          <Block style={{paddingHorizontal: 20}}>
            <Text color="white"
                  bold center style={{paddingTop: 50, paddingBottom: 5, fontFamily: 'montserrat-regular'}}>Для Співробітника</Text>
            <Text color="white" size={16} style={{paddingTop: 10, paddingBottom: 5}}>Щоб розпочаті роботу необхідно натиснути працюю</Text>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.FACEBOOK
  },
  padded: {
    flex: 1,
    paddingTop: 180,

  }
});

export default About;
