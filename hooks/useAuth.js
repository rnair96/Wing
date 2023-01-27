import React, { createContext, useContext } from 'react'
import { useState, useEffect, useMemo } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut }from "firebase/auth";
import { auth } from '../firebase';



const AuthContext = createContext({});


export const AuthProvider = ({children}) => {
  // const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId:'597753804912-bihmb3jepe4gviklnp2ohk5dnrnse0o7.apps.googleusercontent.comm',
      iosClientId:'597753804912-pn0ai3q4g0m8dqaml10aivm4ijc4uauf.apps.googleusercontent.com',
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
      const result = await promptAsync({ useProxy: true, showInRecents: true});
      setLoading(true);

      if (result.type === 'success') {
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
      console.log("error with login")
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