import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';


const PromptPicker = ({tagline, prompt, setPromptVisible, setTag, setPrompt}) => {

    const deletePrompt = () => {
        setTag(null);
        setPrompt(null);
      }

    return (
        <View>
            {tagline && prompt ? (
                <View style={{ alignItems: "flex-end" }}>
                    <TouchableOpacity style={{ left: 8, borderRadius: 50, borderWidth: 1, alignItems: "center", justifyContent: "center", width: 30, backgroundColor: "white", zIndex: 1, marginRight:5 }} onPress={() => setTag? deletePrompt(): setPromptVisible(true)}>
                        <Entypo name="cross" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ bottom: 10, backgroundColor: "#E0E0E0", padding: 10, borderRadius: 15, alignItems: "center", zIndex: 0 }}>
                        <Text>{prompt}</Text>
                        <Text style={{ fontWeight: "bold", paddingTop: 10 }}>{tagline}</Text>
                    </View>
                </View>
            ) : (
                <TouchableOpacity style={{ borderWidth: 1, borderColor: "#00BFFF", margin: 10, borderRadius: 10 }} onPress={() => setPromptVisible(true)}>
                    <Text style={{ color: "#00BFFF", fontSize: 20, padding: 5 }}>Tap to Add A Prompt</Text>
                </TouchableOpacity>
            )

            }
        </View>
    )

}

export default PromptPicker;