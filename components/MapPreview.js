import React from 'react';
import {Image, StyleSheet} from 'react-native';
import lets from "../env";
import {Block, Text, theme} from "galio-framework";
const MapPreview = props => {
    let imagePreviewUrl;
    if (props.location) {
        imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${props.location.lat},${props.location.lgn}&zoom=12&size=400x200&maptype=roadmap
&markers=color:red%7Clabel:C%7C${props.location.lat},${props.location.lgn}
&key=${lets.googleApiKey}`;
    }

    return <Block style={{...styles.mapPreview, ...props.style}}>
        {props.location ? <Image style={styles.mapImage} source={{uri: imagePreviewUrl}}/> : props.children}
    </Block>
}

const styles = StyleSheet.create({
    mapPreview: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapImage: {
        width: '100%',
        height: '100%'
    }
});

export default MapPreview;
