import React from 'react';
import { Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
// screens
import About from '../screens/About';
import Add from '../screens/Add';
import Profile from '../screens/Profile';
import Register from '../screens/Register';
import AddArea from "../screens/AddArea";
import MapScreen from "../screens/MapScreen";
import Onboarding from '../screens/Onboarding';
// drawer
import CustomDrawerContent from "./Menu";
// header for screens
import { Header, Icon} from '../components';
import { nowTheme, tabs } from "../constants";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function AccountStack(props) {
  return (
    <Stack.Navigator initialRouteName="Account" mode="card" headerMode="screen">
      <Stack.Screen
        name="Account"
        component={Register}
        options={{
          headerShown: false,
          header: ({ navigation, scene }) => (
            <Header
              transparent
              title=""
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}
function AboutStack(props) {
    return(
        <Stack.Navigator initialRouteName="About" mode="card" headerMode="screen">
            <Stack.Screen
                name="ІНФОРМАЦІЯ"
                component={About}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="О приложении"
                            back
                            white
                            transparent
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    headerTransparent: true,
                }}
            />
        </Stack.Navigator>
    );
}
function AddStack(props) {
    return(
        <Stack.Navigator initialRouteName="Add" mode="card" headerMode="screen">
            <Stack.Screen
                name="Add"
                component={Add}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="Добавление сотрудника"
                            back
                            white
                            transparent
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    headerTransparent: true,
                }}
            />
        </Stack.Navigator>
    );
}
function AddAreaStack(props) {
    return(
        <Stack.Navigator initialRouteName="AddArea" mode="card" headerMode="screen">
            <Stack.Screen
                name="AddArea"
                component={AddArea}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="Добавление рабочей области"
                            back
                            white
                            transparent
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    headerTransparent: true,
                }}
            />
            <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="Добавление рабочей области на карте"
                            back
                            black
                            transparent
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    headerTransparent: true,
                }}
            />
        </Stack.Navigator>
    );
}
function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title=""
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true
        }}
      />

    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: nowTheme.COLORS.BLACK,
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintcolor: nowTheme.COLORS.WHITE,
        inactiveTintColor: nowTheme.COLORS.WHITE,
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Profile"
    >
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="ІНФОРМАЦІЯ" component={AboutStack} />
      <Drawer.Screen name="Add" component={AddStack} />
      <Drawer.Screen name="AddArea" component={AddAreaStack} />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true
        }}
      />
    <Stack.Screen
        name="Account"
        component={Register}
        options={{
            headerShown: false,
            header: ({ navigation, scene }) => (
                <Header
                    transparent
                    title=""
                    navigation={navigation}
                    scene={scene}
                />
            ),
            headerTransparent: true
        }}
        />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

