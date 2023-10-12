import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleAuthProvider, OAuthProvider, onAuthStateChanged, signInWithCredential, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from '../firebase';
import { getDoc, doc, getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../firebase';
import Constants from 'expo-constants';
import { ImageBackground } from 'react-native';




const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);


  const { androidClientId, iosClientId, expoClientId, projectName, prodUsers,
    devUsers, prodMatches, devMatches, devAnnouncements, prodAnnouncements, devFetchCards, prodFetchCards, prodDeleteUser, devDeleteUser } = Constants.expoConfig.extra


  if (__DEV__) {
    console.log('dev user signin, setting dev environment');
    global.users = devUsers;
    global.matches = devMatches;
    global.announcements = devAnnouncements;
    global.fetchcards = devFetchCards;
    global.deleteuser = devDeleteUser;
  } else {
    console.log('prod user signin, setting prod environment');
    global.users = prodUsers;
    global.matches = prodMatches;
    global.announcements = prodAnnouncements;
    global.fetchcards = prodFetchCards;
    global.deleteuser = prodDeleteUser;

  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId,
    iosClientId: iosClientId,
    expoClientId: expoClientId,
    scopes: ["profile", "email"],
    // redirectUri: makeRedirectUri({
    //   scheme: 'com.googleusercontent.apps.597753804912-dspeqvn4dblne96m842pgfiu4a66kha2'
    // }),
  });


  useEffect(() => {
    //checks the authentication state of user in firebase 
    onAuthStateChanged(auth, (authuser) => {
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
    else if (response?.type === 'cancel') {
      setLoading(false);
      alert("Login incomplete. Please try again.");

    }

  }, [response]);


  const getUserData = async (idToken, accessToken) => {
    try {
      const userData = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((response) => response.json());
      setUser(userData);

      //signs in to firestore db
      const credential = GoogleAuthProvider.credential(idToken, accessToken)
      await signInWithCredential(auth, credential)
        .then(() => {
          setLoading(false);
        });
    } catch (e) {
      console.log("There was an error");
      setLoading(false);
    }

  }


  const signInWithGoogle = async () => {
    try {

      //gets accesstokens for Google authenticaiton
      await promptAsync({ showInRecents: true, projectNameForProxy: projectName })
        .then(() => {
          setLoading(true);
        })

    } catch (e) {
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
        const credential = appleProvider.credential({ idToken: identityToken });//, rawNonce: nonce
        // Sentry.captureMessage(`credential returned ${credential}`);

        await signInWithCredential(auth, credential).then(async (result) => {
          const signedInUser = result.user;
          const userDocRef = doc(db, global.users, signedInUser.uid);
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
      .then(async (userCredential) => {
        const user = userCredential.user;

        await updateProfile(user, { displayName: name, password: password });
        console.log("User created and display name updated:", user);

        setUser(user);

      })
      .catch((error) => {
        const errorMessage = error.message;
        const errorCode = error.code;

        console.log("error in sign up", errorMessage)

        if (errorCode === 'auth/email-already-in-use') {
          alert('This email is already associated with an existing account.');
        } else {
          // Handle other possible errors or display a general error message
          alert('An error occurred during sign up. Please try again.');
        }
      });
    setLoading(false);
  }

  const logInManually = async (email, password) => {
    setLoading(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user logged in", user)
        setUser(user)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error in log in", errorMessage);

        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
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
      const userSnapshot = await getDocs(query(collection(db, global.users), where('email', '==', email)));
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

  const updateUserPassword = async (currentPassword, newPassword) => {
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
        console.log("error", error)
        alert('An error occurred. Please try again.');
        return false;
      }
    }
  }


  const logout = () => {
    setLoading(true);
    setUser(null);
    signOut(auth).catch((error) => console.error(error))
    setLoading(false);
  }

  const deleteUserAuth = async () => {
    if (user) {
      try {
        await user.delete(); // `user` is from your state, assuming it's the currently logged-in user.
        console.log("User deleted from Firebase Auth successfully");
        setUser(null);
        // logout();
      } catch (error) {
        console.error("Error deleting user from Firebase Auth:", error);
      }
    } else {
      console.log("no user found");
    }
  }

  const authenticateUserForDelete = async (password) => {
    try {
      const credential = EmailAuthProvider.credential(user.email, password);

      // Re-authenticate the user with the credential
      await reauthenticateWithCredential(user, credential);

      return true;
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        alert('Incorrect current password. Please try again.');
        return false;
      } else {
        console.log("error", error)
        alert('An error occurred. Please try again.');
        return false;
      }
    }
  }



  const deleteAll = async (ispass, password) => {
    setLoading(true);
    let isauthenticated = false;
    if (ispass) {
      console.log("authenticating...")
      isauthenticated = await authenticateUserForDelete(password);
      console.log("authenticated", isauthenticated);
    }
    if ((ispass && isauthenticated) || !ispass) {
      console.log("successfully authenticad user for delete")

      const functionURL = `${global.deleteuser}${user.uid}`

      console.log("function url", functionURL);

      fetch(functionURL, {
        method: 'DELETE'
      })
        // .then(response => response.text())  // Get the response text
        // .then(text => {
        //   try {
        //     // Try to parse the response text as JSON
        //     return JSON.parse(text);
        //   } catch (err) {
        //     // If it's not JSON, throw the raw text
        //     throw text;
        //   }
        // })
        .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
        .then(data => {
          // Check if the parsed response is OK
          // if (data.error) {
          //   throw new Error(data.error);
          // }
          console.log("user deleted", data);
          deleteUserAuth();
          setLoading(false);
        })
        .catch(error => {
          console.error("Error deleting user", error);
          setLoading(false);
          //add sentry capture
          });

    }
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
        updateUserPassword,
        deleteAll
      }}
    >
      {loading &&
        <ImageBackground
          resizeMode='cover'
          style={{ flex: 1 }}
          source={require("../assets/splash_wing.png")}
        />}
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}