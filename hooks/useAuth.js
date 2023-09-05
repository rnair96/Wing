import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleAuthProvider, OAuthProvider, onAuthStateChanged, signInWithCredential, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from '../firebase';
import {  deleteDoc, writeBatch, getDoc, doc, getDocs, collection, where, query } from 'firebase/firestore';
import { db, storage } from '../firebase';
import Constants from 'expo-constants';
import { deleteObject, ref, listAll} from "firebase/storage";
// import { v4 as uuidv4 } from 'uuid';
// import 'react-native-get-random-values';
// import * as Sentry from "@sentry/react";



const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingSwipes, setLoadingSwipes] = useState(false);
  const [loadingPasses, setLoadingPasses] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const { androidClientId, iosClientId, expoClientId, projectName, prodUsers, devUsers, prodMatches, devMatches } = Constants.manifest.extra


  if (__DEV__) {
    console.log('dev user signin, setting dev environment');
    global.users = devUsers;
    global.matches = devMatches;
  } else {
    console.log('prod user signin, setting prod environment');
    global.users = prodUsers;
    global.matches = prodMatches;
  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId,
    iosClientId: iosClientId,
    expoClientId: expoClientId,
    scopes: ["profile", "email"]
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
    setUser(null);
    signOut(auth).catch((error) => console.error(error))
  }

  const deleteUserAuth = async () => {
    if(user){
      try {
        await user.delete(); // `user` is from your state, assuming it's the currently logged-in user.
        console.log("User deleted from Firebase Auth successfully");
        logout();
    } catch (error) {
        console.error("Error deleting user from Firebase Auth:", error);
    }
    } else {
      console.log("no user found");
    }
}

  const authenticateUserForDelete = async(password) => {
    try{
      const credential = EmailAuthProvider.credential(user.email, password);

      // Re-authenticate the user with the credential
      await reauthenticateWithCredential(user, credential).then(()=>{
        return true;
      });

      // return true;
    }catch (error) {
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
    if(ispass && authenticateUserForDelete(password)){
    await deleteInfo().then(() => {
      if (!loadingImages && !loadingMatches && !loadingPasses && !loadingSwipes && !loadingUser) {
        console.log("All Info deleted");
        deleteUserAuth();
      }
    }).catch(error => {
      console.error('There was an error', error);
    })
    }
  }

  const deleteInfo = async () => {
    setLoadingImages(true);
    setLoadingMatches(true);
    setLoadingPasses(true);
    setLoadingSwipes(true);
    setLoadingUser(true)
    deleteStoredImages();
    deleteMatches();
    deleteSwipeHistory("swipes");
    deleteSwipeHistory("passes");
    deleteUser()
    // deleteOthersHistory();
  }

  const deleteUser = async () => {
    await deleteDoc(doc(db, global.users, user.uid)).then(() => {
      // deleteUserAuth();
      console.log("User has been deleted successfully from DB.")
    })
      .catch(error => {
        console.log('Error deleting user', error);
      })
    
    setLoadingUser(false);
  }

  const deleteMatches = async () => {
    const batch = writeBatch(db);
    const matches = []
    await getDocs(collection(db, global.matches)).then((snapshot) => {
      snapshot.docs.filter((doc) => doc.id.includes(user.uid)).map((doc) => matches.push(doc.id))
    })

    if (matches.length > 0) {

      matches.map((matchID) => {
        batch.delete(doc(db, global.matches, matchID))
      })

      await batch.commit().then(() => {
        console.log('Matches deleted successfully.');
      }).catch((error) => {
        console.error('Error deleting matches: ', error);
      });
    }
    setLoadingMatches(false);
  }


  const deleteSwipeHistory = async (swipe_collection) => {
    const batch = writeBatch(db);
    const history = []
    await getDocs(collection(db, global.users, user.uid, swipe_collection)).then((snapshot) => {
      snapshot.docs.map((doc) => history.push(doc.id))
    })


    if (history.length > 0) {
      history.map((historyID) => {
        batch.delete(doc(db, global.users, user.uid, swipe_collection, historyID))
      })

      await batch.commit().then(() => {
        console.log(swipe_collection, 'History deleted successfully.');
      }).catch((error) => {
        console.error('Error deleting', swipe_collection, 'history: ', error);
      });
    }

    swipe_collection === "swipes" ? setLoadingSwipes(false) : setLoadingPasses(false);

  }

  const deleteStoredImages = async () => {
    console.log("Deleting images")

    for (let i = 0; i < 3; i++) {
      const folderName = `images/${user.uid}/${i}/`
      const folderRef = ref(storage, folderName);

      listAll(folderRef)
        .then((result) => {
          // Loop through each file and delete it
          result.items.forEach((fileRef) => {
            deleteObject(fileRef).then(() => {
              console.log(`File ${fileRef.name} deleted successfully`);
            }).catch((error) => {
              console.error(`Error deleting file ${fileRef.name}: ${error}`);
            });
          });

          // Once all files are deleted, delete the folder itself
          // deleteObject(folderRef).then(() => {
          //     console.log(`Folder ${folderName} deleted successfully`);
          // }).catch((error) => {
          //     console.error(`Error deleting folder ${folderName}: ${error}`);
          // });
        })
        .catch((error) => {
          console.error(`Error listing files in folder ${folderName}: ${error}`);
        });

    }
    setLoadingImages(false);
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
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}