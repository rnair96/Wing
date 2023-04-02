import React, { createContext, useContext } from 'react'
import { useState, useEffect, useMemo } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut }from "firebase/auth";
import { auth } from '../firebase';
import * as WebBrowser from 'expo-web-browser';


WebBrowser.maybeCompleteAuthSession();//dismiss popup


const AuthContext = createContext({});


export const AuthProvider = ({children}) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);



    const [request, response, promptAsync] = Google.useAuthRequest({
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


  useEffect(() => {
      if (!user && response?.type === 'success') {        
        getUserData(response.authentication.idToken, response.authentication.accessToken);
      }
  }, [response]);


  const getUserData = async (idToken, accessToken) => {
    const userData = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }).then((response) => response.json());
      setUser(userData);

      //signs in to firestore db
      const credential = GoogleAuthProvider.credential(idToken , accessToken)
      await signInWithCredential(auth, credential).then(()=>{
        setLoading(false);
      });
  }
    
    

  const signInWithGoogle = async () => {
    try {

      //gets accesstokens for Google authenticaiton

      await promptAsync({ showInRecents: true, projectNameForProxy:'@rnair96/mission_partner'})
      .then(()=> {
        setLoading(true);
      })
      
    }catch (e) {
      console.log("error with login", e)
    }
  }
      

  const logout = () => {
    setUser(null);
    signOut(auth).catch((error) => console.error(error))
}

// const memoedValue = useMemo(
//   () => ({
//     user,
//     logout,
//     signInWithGoogle//pass error and loading too
//   }),Hip
//   [user]
// );


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