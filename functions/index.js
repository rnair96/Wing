/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();

// const env = functions.config().env.name;
// const usersCollection = env === 'dev' ? 'users_test' : 'users';

exports.onSwipe = functions.firestore
    .document("users_test/{userId}/swipes/{swipeId}")
    .onCreate(async (snap, context) => {
      // Get the ID of the user who was swiped on
      const swipedUserId = snap.data().id;
      const message = snap.data().message;
      const timestamp = snap.data().timeSwiped;

      // Get the ID of the user who did the swiping
      const swiperId = context.params.userId;

      // Add a document to the "requests" collection
      // of the user who was swiped on

      // const userDoc = admin.firestore().collection("users_test")
      //     .doc(swipedUserId);
      // const requestsRef = userDoc.collection("requests");

      const requestsRef = admin.firestore().collection("users_test")
          .doc(swipedUserId).collection("requests").doc(swiperId);


      return requestsRef.set({
        id: swiperId,
        message: message,
        timestamp: timestamp,
        read: false,
      });
    });
