import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Constants from 'expo-constants';



export function hasSixtyDaysPassed(firestoreTimestamp) {
    // Convert Firestore timestamp to JavaScript Date object
    const dateFromTimestamp = firestoreTimestamp.toDate();

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in time (in milliseconds)
    const timeDifference = currentDate.getTime() - dateFromTimestamp.getTime();

    // Convert the time difference to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    // Check if the difference is greater than or equal to 30 days
    return daysDifference >= 60;
    //save to variable if less than, return false if not

    //add a check if user matches are greater than 0, if so then return true, otherwise return false
}

export async function hasMatch(userId) {
    try {
        // Reference to the 'matches' collection
        const matchesRef = collection(db, global.matches);

        // Create a query to find matches that include the user's ID in their document ID
        const matchesQuery = query(matchesRef, where('userMatched', 'array-contains', userId));

        // Execute the query
        const querySnapshot = await getDocs(matchesQuery);

        console.log("total match size", querySnapshot.size)

        if(querySnapshot.size > 0){
            const { masterId } = Constants.expoConfig.extra

            // Filter out matches that include the masterId
            const matches = querySnapshot.docs.filter(doc => {
                const usersInMatch = doc.data().userMatched;
                return usersInMatch.includes(userId) && !usersInMatch.includes(masterId);
            });
    
            console.log("match size excluding master", matches.length)

            return matches.length > 0;
        }
    

        return false;
    } catch (error) {
        console.error("Error checking for matches:", error);
        throw error;
    }
}
