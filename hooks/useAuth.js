import React, { createContext, useContext } from 'react'
import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';



const AuthContext = createContext({});


// const config = {
//   androidClientId:'597753804912-t6pd2eg2ta6983j0f5rd6vl4iumg4q4i.apps.googleusercontent.com',
//   iosClientId:'597753804912-pn0ai3q4g0m8dqaml10aivm4ijc4uauf.apps.googleusercontent.com',
//   expoClientId:'418019807053-k8q0432nbo58bq2ue0qqsb0vmjbh98eq.apps.googleusercontent.com',
//   scopes: ["profile", "email"],
//   permissions: ["public_profile", "email", "gender", "location"],
// }

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId:'418019807053-6n9gsa064rg43q1vs9f58aua30e6bmaq.apps.googleusercontent.com',
      iosClientId:'418019807053-3fas9k0qn2orke6p93qf2dgiup2sabi8.apps.googleusercontent.com',
      expoClientId:'418019807053-k8q0432nbo58bq2ue0qqsb0vmjbh98eq.apps.googleusercontent.com'
    });
    
    
      useEffect(() => {
        if (response?.type === "success"){
          setAccessToken(response.authentication.accessToken);
          console.log("getting date in UseAuth")
          getUserData();
        }
      }, [response])


      const getUserData = async () => {
        let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${accessToken}`}
        });
      
        userInfoResponse.json().then(data => {
          setUser(data);
          console.log("get User Data", data)
        });
      };
      

  const logout = () => {
    setUser(null);
    setAccessToken(null);
}


  return (
    <AuthContext.Provider
    value={{
        user,
        logout,
        accessToken,
        promptAsync,
        getUserData
       }}
       >
       {children}
    </AuthContext.Provider>
  )
}

export default function useAuth(){
    return useContext(AuthContext)
}