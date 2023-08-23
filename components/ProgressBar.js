import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress, total, style }) => {
    const width = (progress / total) * 100;
    return (
        <View style={[styles.container, style]}>
            <View style={[styles.progressBar, { width: `${width}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 20,
        width: '100%',
        backgroundColor: 'lightgray',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        width: '0%',
        backgroundColor: 'green',
        borderRadius: 10,
    }
});

export default ProgressBar;
