import React, { useState } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Rating } from 'react-native-ratings';
import { db } from '../firebase';
import { updateDoc, arrayUnion, increment, addDoc, serverTimestamp, doc, collection } from 'firebase/firestore';
import sendPush from '../lib/sendPush';
import { RankBadge } from '../lib/RankBadge';
import useAuth from '../hooks/useAuth';
import { getDoc } from 'firebase/firestore';


const RatingModal = ({ other_user, isVisible, matched, onClose }) => {
  const [rating, setRating] = useState(0);
  const { user } = useAuth();

 const checkifRated = (userId, other_user_ratings) => {
    const ratingObj = other_user_ratings.filter((rating_object) => rating_object.given_by === userId);
    if (ratingObj) {
        return true;
    } else {
        return false;
    }
}


  const handleSubmit = async () => {
    //have to getDoc on user for updated info to use
    const other_user_snapshot = await getDoc(doc(db, global.users, other_user.id))

    const other_user_ratings = other_user_snapshot.get("ratings");


    if(rating >=0.5 && (!other_user_ratings || !checkifRated(user.uid, other_user_ratings))){
        const new_points = rating + other_user_snapshot.get("points");
        let rank = other_user_snapshot.get("rank");
        let promotion = false;
        let promoted_rank = RankBadge.promote(rank)


        //must add levels/stars
        if(RankBadge.determineRank(new_points) === promoted_rank){
            rank = promoted_rank;
            promotion = true;
        }

        const message = "This Wing has rated you "+rating+" out of 5 Stars."
    
        // Update the user's points with the rating
        await updateDoc(doc(db, global.users, other_user.id), {
            points: increment(rating),
            rank: rank,
            recently_promoted: promotion,
            ratings: arrayUnion({
                rating: rating,
                given_by: user.uid
            })
        }).then(async ()=> {
        //add matched details to see in chat, only if not chosen to be anonymous
            const timestamp = serverTimestamp();

            await addDoc(collection(db, global.matches, matched.id, "messages"), {
                timestamp: timestamp,
                userId: user.uid,
                displayName: user.displayName,
                photoURL: matched.users[user.uid].images[0],
                message: message,
                read: false,
            })
            const token =  other_user_snapshot.get("token")
            sendPush(token, "A Wing Has Rated You!","Tap to Learn More",{type:"rated", message: matched})
            if (promotion){
                //create a Promotion screen if recently promoted
                sendPush(token, "You've Been Promoted!","Tap to Learn More",{type:"promotion"})
            } 
            ;
        }).catch((error) => {
            alert(error.message)
        });;

    } else if(other_user_ratings && checkifRated(user.uid, other_user_ratings)){
        alert("Can't submit more than one rating to a given Wing")
    } else {
        alert("Rating cannot be empty");
    }

    onClose();

  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Rate your experience with this Wing</Text>
          <Rating
            type='star'
            ratingCount={5}
            imageSize={40}
            showRating
            onFinishRating={(rating) => setRating(rating)}
            style={{ paddingVertical: 10 }}
          />
          {/* <TouchableOpacity
            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
            onPress={handleSubmit}
          >
            <Text style={styles.textStyle}>Submit Anonymously</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
            onPress={handleSubmit}
          >
            <Text style={styles.textStyle}>Submit in Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.openButton, backgroundColor: "#2196F3", top: 10}}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default RatingModal;
