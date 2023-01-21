import React, { createContext, useContext } from 'react'
import { useState, useEffect, useMemo } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut }from "firebase/auth";
import { auth } from '../firebase';



const AuthContext = createContext({});


// const config = {
//   androidClientId:'597753804912-t6pd2eg2ta6983j0f5rd6vl4iumg4q4i.apps.googleusercontent.com', //update
//   iosClientId:'597753804912-pn0ai3q4g0m8dqaml10aivm4ijc4uauf.apps.googleusercontent.com',
//   expoClientId:'418019807053-k8q0432nbo58bq2ue0qqsb0vmjbh98eq.apps.googleusercontent.com', // remoe
//   scopes: ["profile", "email"],
//   permissions: ["public_profile", "email", "gender", "location"],
// }


export const AuthProvider = ({children}) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  // const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId:'597753804912-bihmb3jepe4gviklnp2ohk5dnrnse0o7.apps.googleusercontent.comm',
      iosClientId:'597753804912-pn0ai3q4g0m8dqaml10aivm4ijc4uauf.apps.googleusercontent.com',
      expoClientId:'597753804912-594mab8ne94m8t38ek14oustpimdf35o.apps.googleusercontent.com'
    });
    
    
      useEffect(() => {
        if (response?.type === "success"){
          setAccessToken(response.authentication.accessToken);
          setIdToken(response.authentication.idToken);
          getUserData();
        }
        // return Promise.reject();
        //catch((err=> setError(error));
        //.finally(()=>setLoading(false));
      }, [response])


      useEffect(() => {
        onAuthStateChanged(auth, (user)=> {
          if (user) {
            //logged in
            setUser(user);
          } else {
            //Not logged in...
            setUser(null);
          }

          setLoadingInitial(false);
        });
      },[]);


      const getUserData = async () => {
        let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${accessToken}`}
        });
      
        userInfoResponse.json().then(data => {
          setUser(data);
          console.log("get User Data", data)
        });
        const credential = GoogleAuthProvider.credential(idToken ,accessToken)
        await signInWithCredential(auth, credential);
      };

      const signInWithGoogle = async () => {
        promptAsync({ useProxy: true, showInRecents: true});
    }
      

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    // setLoading(true);
    // signOut(auth).catch((error) => setError(error)).finally(()=> setLoading(false))
}

// const memoedValue = useMemo(
//   () => ({
//     user,
//     logout,
//     signInWithGoogle//pass error and loading too
//   }),
//   [user]
// );//caches the values


  return (
    <AuthContext.Provider
    value={{
      user,
      logout,
      signInWithGoogle//pass error and loading too
       }}
       >
       {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

export default function useAuth(){
    return useContext(AuthContext)
}