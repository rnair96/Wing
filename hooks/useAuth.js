import React, { createContext, useContext } from 'react'
import { useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState("Raj")

  const logout = () => {
    setUser(null);
}

const raj = () =>{
    setUser("Raj");
}

  return (
    <AuthContext.Provider
    value={{
        user,
        logout,
        raj
       }}
       >
       {children}
    </AuthContext.Provider>
  )
}

export default function useAuth(){
    return useContext(AuthContext)
}