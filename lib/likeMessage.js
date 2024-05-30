import { updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import * as Sentry from "@sentry/react";


const likeMessage = (message, userid, fb_doc) => {
    const did_user_like = message?.likes ? message.likes.includes(userid): false

    if(did_user_like){
        console.log("unliking message", message.id)
    try {
        updateDoc(fb_doc, {
            likes: arrayRemove(userid)
        })
    } catch (error) {
        console.log("ERROR, there was an error in liking message in groupchat", error);
        Sentry.captureMessage(`there was an error in liking a message to groupchat ${error.message} for ${userid}}`)
        alert("Error sending message. Try again later.")

    }
    } else{
        console.log("liking message", message.id)
    try {
        updateDoc(fb_doc, {
            likes: arrayUnion(userid)
        })
    } catch (error) {
        console.log("ERROR, there was an error in liking message in groupchat", error);
        Sentry.captureMessage(`there was an error in liking a message to groupchat ${error.message} for ${userid}}`)
        alert("Error sending message. Try again later.")

    }
    }
}

export default likeMessage;