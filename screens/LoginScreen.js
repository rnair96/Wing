import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { StyleSheet, ImageBackground, Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native'
import useAuth from '../hooks/useAuth';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();


const LoginScreen = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isSignin, setIsSignin] = useState(false);
    const { signInWithGoogle, signInWithApple, logInManually } = useAuth();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const navigation = useNavigation();


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <SafeAreaView style={[styles.container]}>
            <ImageBackground
                resizeMode='cover'
                style={[styles.container]}
                source={require("../images/bizdudes.jpg")}>
                {/* <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}> */}
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={{ height: "30%", justifyContent: "center", alignItems: "center", justifyContent: "space-evenly" }}>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 40, fontFamily: Platform.OS === "android" ? "sans-serif-condensed": "Times New Roman", color: "#00308F", left: 13 }}>Wing</Text>
                            <Image style={styles.iconcontainer} source={require("../images/darkbluelogocorrect.png")} />
                        </View>
                        <View style={{ height: "50%", top: "10%", justifyContent: "space-evenly" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: Platform.OS === "android" ? "sans-serif-condensed": "Times New Roman", color: "#00308F" }}>Find Your Wingman.</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: Platform.OS === "android" ? "sans-serif-condensed": "Times New Roman", color: "#00308F" }}>Delete Dating Apps.</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

                {isSignin ? (
                    <View style={{ marginVertical: "10%", marginHorizontal: "20%", height: "40%" }}>

                        {isLogin ? (
                            <View style={{ marginVertical: isKeyboardVisible ? "-5%" : "10%", alignItems: 'center', height: "100%", justifyContent: "space-evenly" }}>
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                                    style={{ alignItems: "center", justifyContent: "space-evenly", height: "80%" }}
                                    keyboardVerticalOffset={5}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: 20, fontFamily: Platform.OS === "android" ? "sans-serif-condensed" : "Times New Roman", color: "#00308F" }}>Email</Text>
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder={'example@example.com'}
                                        style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "white", width: 180 }} />
                                    <Text style={{ fontWeight: "bold", fontSize: 20, fontFamily: Platform.OS === "android" ? "sans-serif-condensed" : "Times New Roman", color: "#00308F" }}>Password</Text>
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        placeholder={'*************'}
                                        style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "white", width: 180, justifyContent: "center" }} />
                                    <TouchableOpacity style={styles.opacitycontainer} onPress={() => logInManually(email, password)}>
                                        <Text style={styles.textcontainer}>Log In</Text>
                                    </TouchableOpacity>
                                </KeyboardAvoidingView>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={{ color: '#00308F', textDecorationLine: 'underline' }}>Forgot Password?</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsLogin(false)}>
                                    <Text style={{ color: '#00308F', textDecorationLine: 'underline' }}>Go Back</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ height: "100%", alignItems: 'center', justifyContent: "space-evenly" }}>
                                <TouchableOpacity style={styles.opacitycontainer} onPress={() => setIsLogin(true)}>
                                    <Text style={styles.textcontainer}>Log In Manually</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.opacitycontainer} onPress={() => navigation.navigate("SignUp")}>
                                    <Text style={styles.textcontainer}>Sign Up Manually</Text>
                                </TouchableOpacity>
                                <Text style={{ fontWeight: "bold", fontSize: 15, fontFamily: Platform.OS === "android" ? "sans-serif-condensed" : "Times New Roman", color: "#00308F" }}>Or</Text>

                                <TouchableOpacity style={styles.opacitycontainer} onPress={signInWithGoogle}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Image style={{ height: 20, width: 20, right: 10, backgroundColor: "#00308F" }} source={require("../images/google_png.png")} />
                                        <Text style={styles.textcontainer}>Sign In With Google</Text>
                                    </View>
                                </TouchableOpacity>
                                {Platform.OS === "ios" &&
                                    <TouchableOpacity style={styles.opacitycontainer} onPress={signInWithApple}>
                                        <View style={{ flexDirection: "row" }}>
                                            <Image style={{ height: 20, width: 15, right: 15, backgroundColor: "#00308F" }} source={require("../images/apple_logo.png")} />
                                            <Text style={styles.textcontainer}>Sign In With Apple</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </View>

                        )}
                    </View>
                ) : (
                    <View style={{ height: "100%", alignItems: 'center', justifyContent: "center" }}>
                        <TouchableOpacity style={styles.opacitycontainer} onPress={() => setIsSignin(true)}>
                            <Text style={styles.textcontainer}>Enter</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* </KeyboardAvoidingView> */}
                {/* </View> */}
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    opacitycontainer: {
        backgroundColor: "#00308F",
        padding: 10,
        borderRadius: 10,
        width: 200,
        alignItems: "center",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.41,
        elevation: 5
    },
    textcontainer: {
        alignItems: 'center',
        fontWeight: 'bold',
        color: "white"
    },
    iconcontainer: {
        // left: 5,
        height: 45,
        width: 45,
        left: 13
        // backgroundColor: "#00BFFF",
        // borderRadius: 50,
        // borderColor: "#00308F",
        // borderWidth: 1
    }
});

export default LoginScreen
