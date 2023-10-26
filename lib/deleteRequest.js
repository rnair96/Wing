import { db } from "../firebase";
import { doc, writeBatch } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';

const deleteRequest = async (detailsId, userId) => {
    // delete doc from Request
    //add id to passedIds containing just id
    const batch = writeBatch(db);
    console.log("deleting request", detailsId, userId)

    try {

        batch.delete(doc(db, global.users, userId, "requests", detailsId));


        batch.set(doc(db, global.users, userId, "passes", detailsId), {
            id: detailsId
        })

        await batch.commit().then(() => {
            // navigator.navigate("ToggleChat");
            console.log("Request has been deleted from db and user has been moved to passed collection.");
        })


    } catch (error) {
        console.log("ERROR, there was an error in deleting request", error)
    }

}

export default deleteRequest;
