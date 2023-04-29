import { db } from "../firebase";
import { deleteDoc, doc, writeBatch, collection, getDocs } from 'firebase/firestore';

const deleteMatchFull = async(match_id, navigator) => {

    const deleteMatch = async () => {
        await deleteDoc(doc(db, 'matches', match_id)).then(() => {
           console.log("Match has been deleted successfully.")
           navigator.navigate("Chat")
            
        })
        .catch(error => {
            console.log('Error deleting Match',error);
        })
    }
    
      //move to library function and pass in matchedDetails id
    const deleteMessages = async () => {
        const batch = writeBatch(db);
        const messages =[]
        await getDocs(collection(db,"matches", match_id, "messages")).then((snapshot) => {
            snapshot.docs.map((doc) => messages.push(doc.id))
        })
    
        if (messages.length>0){
            messages.map((messageID)=>{
                batch.delete(doc(db,'matches', match_id, "messages", messageID))
            })
    
            await batch.commit().then(() => {
                console.log('Messages deleted successfully.');
                deleteMatch();
            }).catch((error) => {
                console.error('Error deleting messages: ', error);
            });
        } else {
          deleteMatch();
        }
    }

    deleteMessages();
}


export default deleteMatchFull;
