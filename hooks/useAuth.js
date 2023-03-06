import React, { createContext, useContext } from 'react'
import { useState, useEffect, useMemo } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut }from "firebase/auth";
import { auth } from '../firebase';
import * as WebBrowser from 'expo-web-browser';


WebBrowser.maybeCompleteAuthSession();//dismiss popup


const AuthContext = createContext({});


export const AuthProvider = ({children}) => {
  // const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);


  const [request, fullResult, promptAsync] = Google.useIdTokenAuthRequest({
      androidClientId:'597753804912-bihmb3jepe4gviklnp2ohk5dnrnse0o7.apps.googleusercontent.comm',
      iosClientId:'597753804912-dspeqvn4dblne96m842pgfiu4a66kha2.apps.googleusercontent.com',
      expoClientId:'597753804912-594mab8ne94m8t38ek14oustpimdf35o.apps.googleusercontent.com',
      scopes: ["profile", "email"],
      permissions: ["public_profile", "email", "gender", "location"]
    });
    
    
    useEffect(() => {
      //checks the authentication state of user in firebase 
      onAuthStateChanged(auth, (authuser)=> {
        if (authuser) {
          //logged in
          setUser(authuser);
          // setLoadingInitial(false);
        } else {
          //Not logged in...
          setUser(null);
        }

        // setLoadingInitial(false);
      });
    }, []);
    
    

  const signInWithGoogle = async () => {
    try {
      //gets accesstokens for Google authenticaiton
      const result = await promptAsync({ useProxy: false, showInRecents: true, projectNameForProxy:'@rnair96/mission_partner'});//, projectNameForProxy:"@rkingnair@gmail.com/mission_partner"
      setLoading(true);

      // console.log("full Result",fullResult);
      // console.log("result",result);


      if (fullResult?.type === 'success') {
        // Token is always filled, when running on iOS/Android and when running in Expo
        const userData = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: {
            Authorization: `Bearer ${fullResult.params.access_token}`,
          },
        }).then((response) => response.json());
        setUser(userData);


        //signs in to firestore db
        const credential = GoogleAuthProvider.credential(fullResult.params.id_token ,result.params.access_token)
        await signInWithCredential(auth, credential);

      } else if (result.type === 'success' && result.authentication) {

        //fetch and sets user data from Google via token
        const userData = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: {
            Authorization: `Bearer ${result.authentication.accessToken}`,
          },
        }).then((response) => response.json());
        setUser(userData);


        //signs in to firestore db
        const credential = GoogleAuthProvider.credential(result.authentication.idToken ,result.authentication.accessToken)
        await signInWithCredential(auth, credential);
        
    } else {
      console.log('cancelled');
    } 
       
    }catch (e) {
      console.log("error with login", e)
    }finally{
      setLoading(false);
    }
  }
      

  const logout = () => {
    setUser(null);
    // setLoadingInitial(true);
    // setLoading(true);
    signOut(auth).catch((error) => setError(error))
}

// const memoedValue = useMemo(
//   () => ({
//     user,
//     logout,
//     signInWithGoogle//pass error and loading too
//   }),Hip
//   [user]
// );//caches the values


  return (
    <AuthContext.Provider
    value={{ 
      user,
      logout,
      signInWithGoogle}}
       >
       {!loading && children}
       {/* !loadingInitial &&  */}
    </AuthContext.Provider>
  )
}

export default function useAuth(){
    return useContext(AuthContext)
}