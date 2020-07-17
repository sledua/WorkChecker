import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet} from 'react-native'
import MapView, {Marker} from "react-native-maps";
import {Block, Button, Text, theme} from "galio-framework";

const MapScreen = ({navigation}) => {
    const [selectedLocation, setSelectedLocation] = useState();
    const mapRegion = {
        latitude: 49.9934983,
        longitude: 36.2303817,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }
    const selectLocationHandler = event => {
        setSelectedLocation({
            lat: event.nativeEvent.coordinate.latitude,
            lgn: event.nativeEvent.coordinate.longitude
        })

    }
    let markerCoordinates;
    if(selectedLocation) {
        markerCoordinates = {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lgn
        };
    }
    const saveLocationHandler = useCallback(()=>{
        if(!selectedLocation) {
            return;
        }
        navigation.goBack();
        navigation.navigate('AddArea', {pickedLocation: selectedLocation});

    },[navigation ,selectedLocation]);
    console.log(selectedLocation)
    useEffect(()=>{

    },[])
    return(
        <Block style={styles.profileBackground} >
            <MapView
                style={styles.map}
                region={mapRegion}
                onPress={selectLocationHandler}
            >
                {markerCoordinates && (<Marker title="Укажите точку" coordinate={markerCoordinates}/>)}
            </MapView>
            <Block>
                <Button
                    style={{width: '100%'}}
                    onPress={saveLocationHandler}
                >
                    <Text color={theme.COLORS.WHITE} bold size={20}>Save</Text>
                </Button>
            </Block>
        </Block>
    )
}
const styles = StyleSheet.create({
    profileBackground: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.COLORS.FACEBOOK,
        zIndex: -1
    },
    map: {
        flex: 1
    }
})
export default MapScreen;
