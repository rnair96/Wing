import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleAuthProvider, OAuthProvider, onAuthStateChanged, signInWithCredential, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail ,updatePassword, reauthenticateWithCredential, EmailAuthProvider }from "firebase/auth";
import { auth } from '../firebase';
import { getDoc, doc, getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../firebase';
import Constants from 'expo-constants';
// import { v4 as uuidv4 } from 'uuid';
// import 'react-native-get-random-values';
// import * as Sentry from "@sentry/react";



const AuthContext = createContext({});


export const AuthProvider = ({children}) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const {androidClientId, iosClientId, expoClientId, projectName} = Constants.manifest.extra

  let dbusers;

  if (__DEV__) {
    console.log('dev user signin');
    dbusers = 'users_test';
  } else {
    console.log('prod user signin');
    dbusers = 'users';
  }

    const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: androidClientId,
      iosClientId: iosClientId,
      expoClientId: expoClientId,
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
      await promptAsync({ showInRecents: true, projectNameForProxy: projectName})
      .then(()=> {
        setLoading(true);
      })
      
    }catch (e) {
      console.log("error with login", e);
      setLoading(false);
    }
  }

  // const generateNonce = () => {
  //   return uuidv4();
  // };

  const signInWithApple = async () => {

    // Generate the nonce
    // const nonce = generateNonce();

    try {
      setLoading(true);
      const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        // nonce,
      });
  
      const { identityToken, fullName } = appleAuthRequestResponse;

  
      if (identityToken) {
        
        const appleProvider = new OAuthProvider("apple.com");
        const credential = appleProvider.credential({ idToken: identityToken});//, rawNonce: nonce
        // Sentry.captureMessage(`credential returned ${credential}`);

        await signInWithCredential(auth, credential).then(async(result)=>{
          const signedInUser = result.user;
          const userDocRef = doc(db, dbusers, signedInUser.uid);
          // Sentry.captureMessage(`credential signed in ${signedInUser.uid}`)
          const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          // If the user data does not exist in Firestore, it's a new user
          // Sentry.captureMessage(`snapshot doesn't exist ${fullName.givenName} ${fullName.familyName}`)
          updateLocalUser(signedInUser, fullName);
        } else {
          // If the user data exists in Firestore, it's an existing user
          // Sentry.captureMessage(`snapshot exists`)

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
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error in log in", errorMessage);

      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found'||errorCode === 'auth/invalid-email') {
        alert("Login was incorrect. Please try again.");
      } else {
        alert(errorMessage);
      }

    });

    setLoading(false);
  }

  const resetPassword = async (email) => {
    setLoading(true);
  
    try {
  
      // Update user password in Firestore
      const userSnapshot = await getDocs(query(collection(db, dbusers), where('email', '==', email)));
      if (userSnapshot.empty) {
        alert('No user found with this email address.');
        setLoading(false);
        return;
      }
  
      const userDoc = userSnapshot.docs[0];
      console.log("user id", userDoc.id);
      await sendPasswordResetEmail(auth, email);
  
      alert('An email was sent to reset your password.');
      setLoading(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const updateUserPassword = async(currentPassword, newPassword) =>{
    try {
      // Create a credential with the email and current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
      // Re-authenticate the user with the credential
      await reauthenticateWithCredential(user, credential);
  
      // Update the password
      await updatePassword(user, newPassword)
      return true;

    } catch (error) {
      // Handle error messages for incorrect password or other issues
      if (error.code === 'auth/wrong-password') {
        alert('Incorrect current password. Please try again.');
        return false;
      } else if (error.code === "auth/too-many-requests") {
        alert('Too many failed attempts. Please try again later or reset password at Login screen.');
        return false;
      } else {
        console.log("error",error)
        alert('An error occurred. Please try again.');
        return false;
      }
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
      signInWithGoogle,
      signInWithApple,
      signUpManually,
      logInManually,
      resetPassword,
      updateUserPassword}}
       >
       {!loading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth(){
    return useContext(AuthContext)
}