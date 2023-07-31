import { doc, updateDoc, setDoc, getDoc, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase';
import Constants from 'expo-constants';

const {prodUsers, devUsers, prodMatches, devMatches} = Constants.manifest.extra


const env_variables = (variable) => {
    if (variable == 'users'){
        if (__DEV__) {
            console.log('dev users');
            return devUsers;
        } else {
            console.log('prod users');
            return prodUsers;
        }
    } else {
        if (__DEV__) {
            console.log('dev match');
            return devMatches;
        } else {
            console.log('prod match');
            return prodMatches;
        }
    }
}


export const updateUserDB = (userId, updateData) => {
    const users = env_variables('users');
    updateDoc(doc(db, users, userId), updateData);
}

export const updateMatchDB = (matchId, matchData) => {
    const matches = env_variables('matches');
    updateDoc(doc(db, matches, matchId), matchData);
}

export const updateMessageDB = (matchId, messageID, messageData) => {
    const matches = env_variables('matches');
    updateDoc(doc(db, matches, matchId, 'messages', messageID), messageData);
}

export const setUserDB = (userId, updateData) => {
    const users = env_variables('users');
    setDoc(doc(db, users, userId), updateData);
}

export const setUserActionDB = (userId, action, otherUserId, otherUserData) => {
    const users = env_variables('users');
    setDoc(doc(db, users, userId, action, otherUserId), otherUserData)
}

export const setMatchesDB = (matchId, matchData) => {
    const matches = env_variables('matches');
    setDoc(doc(db, matches, matchId), matchData)

}

export const addMessageDB = (matchId, messageData) => {
    const matches = env_variables('matches');
    addDoc(collection(db, matches, matchId, 'messages'), messageData)
}

export const getUserDB = (userId) => {
    const users = env_variables('users');
    getDoc(doc(db, users, userId));
}

export const getUserActionDB = async (userId, action) => {
    const users = env_variables('users');
    await getDocs(collection(db, users, userId, action));
}

export const getMessagesDB = async(matchId) => {
    const matches = env_variables('matches');
    await getDocs(collection(db, matches, matchId, 'messages'));
}

export const deleteUserDB = async (userId) => {
    const users = env_variables('users');
    await deleteDoc(doc(db, users, userId));
}

export const deleteMatchDB = async (matchId) => {
    const matches = env_variables('matches');
    await deleteDoc(doc(db, matches, matchId));
}

