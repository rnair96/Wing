import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleAuthProvider, OAuthProvider, onAuthStateChanged, signInWithCredential, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile }from "firebase/auth";
import { auth } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';


const AuthContext = createContext({});


export const AuthProvider = ({children}) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);


    const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId:'597753804912-bihmb3jepe4gviklnp2ohk5dnrnse0o7.apps.googleusercontent.comm',
      iosClientId:'597753804912-dspeqvn4dblne96m842pgfiu4a66kha2.apps.googleusercontent.com',
      expoClientId:'597753804912-594mab8ne94m8t38ek14oustpimdf35o.apps.googleusercontent.com',
      scopes: ["profile", "email"]
    });
    
    
    useEffect(() => {
      //checks the authentication state of user in firebase 
      onAuthStateChanged(auth, (authuser)=> {
        if (authuser) {
          //logged in
          setUser(authuser);
        } else {
          //Not logged in...
          setUser(null);
        }

      });
    }, []);


  useEffect(() => {
      if (!user && response?.type === 'success') {        
        getUserData(response.authentication.idToken, response.authentication.accessToken);
      } 
      else if (response?.type === 'cancel'){
        setLoading(false);
        alert("Login incomplete. Please try again.");
        
      }
      
  }, [response]);


  const getUserData = async (idToken, accessToken) => {
    try{
      const userData = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }).then((response) => response.json());
      setUser(userData);

      //signs in to firestore db
      const credential = GoogleAuthProvider.credential(idToken , accessToken)
      await signInWithCredential(auth, credential)
      .then(()=>{
        setLoading(false);
      });
    } catch(e){
      console.log("There was an error");
      setLoading(false);
    }
    
  }
    

  const signInWithGoogle = async () => {
    try {

      //gets accesstokens for Google authenticaiton
      await promptAsync({ showInRecents: true, projectNameForProxy:'@rnair96/mission_partner'})
      .then(()=> {
        setLoading(true);
      })
      
    }catch (e) {
      console.log("error with login", e);
      setLoading(false);
    }
  }

  const signInWithApple = async () => {

    try {
      setLoading(true);
      const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
  
      const { identityToken, fullName } = appleAuthRequestResponse;
  
      if (identityToken) {
        
        const appleProvider = new OAuthProvider("apple.com");
        const credential = appleProvider.credential({ idToken: identityToken });
        await signInWithCredential(auth, credential).then(async(result)=>{
          const signedInUser = result.user;
          const userDocRef = doc(db, 'users', signedInUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          // If the user data does not exist in Firestore, it's a new user
          updateLocalUser(signedInUser, fullName);
        } else {
          // If the user data exists in Firestore, it's an existing user
          setUser(signedInUser);
        }
          setLoading(false);
        });
        
  
      } else {
        throw new Error("No identity token found");
      }
    } catch (e) {
      console.log("error with login", e);
      setLoading(false);
    } 
  }

  const updateLocalUser = (user, fullName) => {
    const updatedUser = { ...user };
    updatedUser.displayName = `${fullName.givenName} ${fullName.familyName}`;
    Sentry.captureMessage(`updated user name ${updatedUser.displayName}`);
    setUser(updatedUser);
  };
  


  const signUpManually = async (email, password, name) => {
    setLoading(true);

    await createUserWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      const user = userCredential.user;

      await updateProfile(user, { displayName : name, password : password});
      console.log("User created and display name updated:", user);
    
    setUser(user);

    })
    .catch((error) => {
    const errorMessage = error.message;
    console.log("error in sign up", errorMessage)
  });
  setLoading(false);
}

  const logInManually = async (email, password) => {
    setLoading(true);

    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("user logged in",user)
      setUser(user)
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log("error in log in", errorMessage)

    });

    setLoading(false);
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
      signInWithGoogle,
      signInWithApple,
      signUpManually,
      logInManually}}
       >
       {!loading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth(){
    return useContext(AuthContext)
}