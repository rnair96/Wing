import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const GoogleSlidesViewer = () => {
    const { workshopSlidesLink } = Constants.expoConfig.extra

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: workshopSlidesLink }}
                style={styles.webview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
    }
});

export default GoogleSlidesViewer;