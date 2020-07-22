import React from 'react';
import { Image } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import { NavigationContainer } from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './store'
import Screens from './navigation/Screens';
import { Images, articles, nowTheme } from './constants';
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const MY_LOCATION = 'My_location';
// cache app images
const assetImages = [
  Images.Onboarding,
  Images.Logo,
  Images.Pro,
  Images.NowLogo,
  Images.iOSLogo,
  Images.androidLogo,
  Images.ProfilePicture,
  Images.CreativeTimLogo,
  Images.InvisionLogo,
  Images.RegisterBackground,
  Images.ProfileBackground
];

// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    fontLoaded: false
  };

  // async componentDidMount() {
  //   Font.loadAsync({
  //     'montserrat-regular': require('./assets/font/Montserrat-Regular.ttf'),
  //     'montserrat-bold': require('./assets/font/Montserrat-Bold.ttf')
  //   });

  //   this.setState({ fontLoaded: true });
  // }
  bgLocationStart = async () => {
    await Location.startLocationUpdatesAsync(MY_LOCATION, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000,
      pausesUpdatesAutomatically: true,
      activityType: Location.ActivityType.AutomotiveNavigation,
      showsBackgroundLocationIndicator: true,
    })
  }
  render() {

    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}

        />
      );
    } else {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <GalioProvider theme={nowTheme}>
              <Block flex>
                <Screens />
              </Block>
            </GalioProvider>
          </NavigationContainer>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    await Font.loadAsync({
      'montserrat-regular': require('./assets/font/Montserrat-Regular.ttf'),
      'montserrat-bold': require('./assets/font/Montserrat-Bold.ttf')
    });

    this.setState({ fontLoaded: true });
    return Promise.all([...cacheImages(assetImages)]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    if (this.state.fontLoaded) {
      this.setState({ isLoadingComplete: true });
    }
  };


  bgLocationStop = async () => {
    await Location.stopLocationUpdatesAsync(MY_LOCATION)
  }
}
TaskManager.defineTask(MY_LOCATION, async ({ data, error }) => {
  if (error) {
    return;
  }
  if (data) {
    const {locations} = data;
    console.log('Received new locations', locations);
    // await fetch(`https://work-checker-b96e4.firebaseio.com/users/${name}/user.json`,
    //     {
    //       method: 'PATCH',
    //       headers: {'Context-Type': 'application/json'},
    //       body: JSON.stringify({bgLocations: locations})
    //     }
    // )
  }
});
