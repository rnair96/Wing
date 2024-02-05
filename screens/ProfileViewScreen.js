import React from 'react';
import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import tagColor from '../lib/colorTag';
import { Ionicons } from '@expo/vector-icons';
import ProfileViewComponent from '../components/ProfileViewComponent';



export const ProfileViewScreen = () => {
    const { params } = useRoute();
    const { profile, canFlag } = params;
    const isFlag = canFlag? canFlag: false;

    const navigation = useNavigation();


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-up-outline" size={40} color="#00308F" />
            </TouchableOpacity>
            <ProfileViewComponent profile={profile} setFlag={isFlag} flagged_type={null} />
        </SafeAreaView>

    )
}

export default ProfileViewScreen;
