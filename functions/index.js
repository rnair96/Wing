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
const express = require("express");


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();

const functionCall = express();


const sendPush = async (token, title, body, data) => {
  console.log("sending push");
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: data,
      }),
    });

    const result = await response.json();

    console.log("result is gotten", result);

    if (result.errors) {
      console.log(`Failed to send push notification: ${result.errors}`);
    }

    return result.data;
  } catch (error) {
    console.log("Error sending push notification:", error);
    return null;
  }
};

const sendPushBatch = async (tokens, title, body, data) => {
  const messages = tokens.map((token) => ({
    to: token,
    title: title,
    body: body,
    data: data,
  }));

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();

    console.log("batch result is gotten", result);

    if (result.some((res) => res.status === "error")) {
      console.log("Some notifications failed:", result);
    }

    return result;
  } catch (error) {
    console.log("Error sending push notifications batch:", error);
    return null;
  }
};


exports.onSwipe = functions.firestore
    .document("users/{userId}/swipes/{swipeId}")
    .onCreate(async (snap, context) => {
    // Get the ID of the user who was swiped on
      const isResponse = snap.data().isResponse;

      if (isResponse) {
        console.log("The latest swipe is a response and not a request.");
        return;
      }


      const swipedUserId = snap.data().id;
      const message = snap.data().message;
      const timestamp = snap.data().timeSwiped;

      // Get the ID of the user who did the swiping
      const swiperId = context.params.userId;

      // Add a document to the "requests" collection
      // of the user who was swiped on

      const requestsRef = admin.firestore().collection("users")
          .doc(swipedUserId).collection("requests").doc(swiperId);

      const request =
    {
      id: swiperId,
      message: message,
      timestamp: timestamp,
      read: false,
    };

      const userDoc = admin.firestore().collection("users")
          .doc(swipedUserId);

      const userSwipingDoc = admin.firestore().collection("users")
          .doc(swiperId);

      const userSnapshot = await userDoc.get();
      const userSwipingsnap = await userSwipingDoc.get();

      if (!userSnapshot.exists || !userSwipingsnap.exists) {
        console.log("Given user not found");
        return;
      }

      const user = userSnapshot.data();

      const swipingUser = userSwipingsnap.data();

      if (user.token && user.token !== "token" &&
      user.token !== "not_granted") {
      // add if user gave permission for request notifications
        const messageDetails = {
          "requestDetails": request,
          "profile": swipingUser,
        };

        console.log("sending push notification to swiped user", swipedUserId);
        console.log("sending message details", messageDetails);
        console.log("sending request message from", swipingUser.displayName);
        console.log("sending request message to token", user.token);


        sendPush(user.token, `New Request from ${swipingUser.displayName}`,
            message, {type: "request", message: messageDetails});
      }

      return requestsRef.set(request);
    });


exports.onSwipeDev = functions.firestore
    .document("users_test/{userId}/swipes/{swipeId}")
    .onCreate(async (snap, context) => {
      const isResponse = snap.data().isResponse;

      if (isResponse) {
        console.log("The latest swipe is a response and not a request.");
        return;
      }

      // Get the ID of the user who was swiped on
      const swipedUserId = snap.data().id;
      const message = snap.data().message;
      const timestamp = snap.data().timeSwiped;

      // Get the ID of the user who did the swiping
      const swiperId = context.params.userId;

      // Add a document to the "requests" collection
      // of the user who was swiped on

      const requestsRef = admin.firestore().collection("users_test")
          .doc(swipedUserId).collection("requests").doc(swiperId);

      const request =
    {
      id: swiperId,
      message: message,
      timestamp: timestamp,
      read: false,
    };

      const userDoc = admin.firestore().collection("users_test")
          .doc(swipedUserId);

      const userSwipingDoc = admin.firestore().collection("users_test")
          .doc(swiperId);

      const userSnapshot = await userDoc.get();
      const userSwipingsnap = await userSwipingDoc.get();

      if (!userSnapshot.exists || !userSwipingsnap.exists) {
        console.log("Given user not found");
        return;
      }

      const user = userSnapshot.data();

      const swipingUser = userSwipingsnap.data();

      if (user.token && user.token !== "token" &&
      user.token !== "not_granted") {
      // add if user gave permission for request notifications
        const messageDetails = {
          "requestDetails": request,
          "profile": swipingUser,
        };

        console.log("sending push notification to swiped user", swipedUserId);
        console.log("sending message details", messageDetails);
        console.log("sending request message from", swipingUser.displayName);
        console.log("sending request message to token", user.token);


        sendPush(user.token, `New Request from ${swipingUser.displayName}`,
            message, {type: "request", message: messageDetails});
      }

      return requestsRef.set(request);
    });


functionCall.get("/getFilteredUsers/:id", async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed"); // Only allow GET requests
    return;
  }

  const userId = req.params.id.replace(/:/g, "");
  // Get user id from query parameter
  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  try {
    // Fetch the ids of the user's "swipes" and "passes"
    const userRef = admin.firestore().collection("users").doc(userId);
    // Fetch the given user's data
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      res.status(404).send("Given user not found");
      return;
    }

    const user = userSnapshot.data();
    // const userPreferences = user.tagPreference;
    const userGender = user.gender;
    let matchingUsersQuery = admin.firestore().collection("users")
        .where("gender", "==", userGender)
        .limit(1000);
    // add limit to size

    // Filter by university student preference
    if (user.university_student && user.universityPreference === "Yes") {
      console.log("filtering for university students");
      matchingUsersQuery = matchingUsersQuery
          .where("university_student.status", "==", "active");
    }

    // Further filter by tag preference
    if (user.tagPreference && user.tagPreference !== "All") {
      console.log("filtering for users with mission tag", user.tagPreference);
      matchingUsersQuery = matchingUsersQuery
          .where("mission_tag", "==", user.tagPreference);
    }

    // Now filter these matched users against excludeIds

    const excludeIds = [userId]; // Start by excluding the user themself

    const swipesSnapshot = await userRef.collection("swipes").get();
    swipesSnapshot.forEach((doc) => {
      excludeIds.push(doc.id);
    });

    const passesSnapshot = await userRef.collection("passes").get();
    passesSnapshot.forEach((doc) => {
      excludeIds.push(doc.id);
    });

    const requestsSnapshot = await userRef.collection("requests").get();
    requestsSnapshot.forEach((doc) => {
      excludeIds.push(doc.id);
    });

    // Fetch users excluding the ids in excludeIds

    // Chunk the excludeIds into groups of 10
    console.log("chunking ids");
    const chunkedExcludeIds = [];
    for (let i = 0; i < excludeIds.length; i += 10) {
      chunkedExcludeIds.push(excludeIds.slice(i, i + 10));
    }

    const usersDataMap = new Map();
    const allQueriedUserIds = [];

    for (const idsChunk of chunkedExcludeIds) {
      console.log("filtering for each chunk");
      const chunkQuery = matchingUsersQuery
          .where(admin.firestore.FieldPath.documentId(), "not-in", idsChunk);

      const chunkSnapshot = await chunkQuery.get();
      chunkSnapshot.forEach((doc) => {
        const userData = doc.data();
        userData.id = doc.id;

        allQueriedUserIds.push(doc.id);
        usersDataMap.set(doc.id, userData);
      });
    }

    // Deduplicate all queried user IDs
    const uniqueQueriedUserIds = [...new Set(allQueriedUserIds)];

    // For each unique ID,
    // check if it appears in every chunked query.
    // If it does, it's a final user ID.
    const finalUserIds = uniqueQueriedUserIds.filter((id) => {
      let appearanceCount = 0;
      chunkedExcludeIds.forEach((chunk) => {
        if (!chunk.includes(id)) {
          appearanceCount++;
        }
      });
      return appearanceCount === chunkedExcludeIds.length;
    });

    // Retrieve user data from the previously stored map
    const uniqueUsers = finalUserIds.map((id) => usersDataMap.get(id));

    console.log("filtering out incomplete profiles");
    const completeUsers = uniqueUsers.filter((user) => {
      return user.mission !== null &&
        user.mission !== "" &&
        user.medals && user.medals.length === 3 &&
        user.images && user.images.length === 3;
    });

    console.log("limiting to 30 profiles or less");
    const finalUsers = completeUsers.length > 30 ?
      completeUsers.slice(0, 30) : completeUsers;

    res.status(200).json(finalUsers);
  } catch (error) {
    console.error("Error fetching filtered users: ", error);
    res.status(500).send("Internal Server Error");
  }
});


functionCall.get("/getFilteredDevUsers/:id", async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed"); // Only allow GET requests
    return;
  }

  const userId = req.params.id.replace(/:/g, "");
  // Get user id from query parameter
  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  try {
    // Fetch the ids of the user's "swipes" and "passes"
    const userRef = admin.firestore().collection("users_test").doc(userId);
    // Fetch the given user's data
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      res.status(404).send("Given user not found");
      return;
    }

    const user = userSnapshot.data();
    // const userPreferences = user.tagPreference;
    const userGender = user.gender;
    let matchingUsersQuery = admin.firestore().collection("users_test")
        .where("gender", "==", userGender)
        .limit(1000);
    // add limit to size

    // Filter by university student preference
    if (user.university_student && user.universityPreference === "Yes") {
      console.log("filtering for university students");
      matchingUsersQuery = matchingUsersQuery
          .where("university_student.status", "==", "active");
    }

    // Further filter by tag preference
    if (user.tagPreference && user.tagPreference !== "All") {
      console.log("filtering for users with mission tag", user.tagPreference);
      matchingUsersQuery = matchingUsersQuery
          .where("mission_tag", "==", user.tagPreference);
    }

    // Now filter these matched users against excludeIds

    const excludeIds = [userId]; // Start by excluding the user themself

    const swipesSnapshot = await userRef.collection("swipes").get();
    swipesSnapshot.forEach((doc) => {
      excludeIds.push(doc.id);
    });

    const passesSnapshot = await userRef.collection("passes").get();
    passesSnapshot.forEach((doc) => {
      excludeIds.push(doc.id);
    });

    const requestsSnapshot = await userRef.collection("requests").get();
    requestsSnapshot.forEach((doc) => {
      excludeIds.push(doc.id);
    });

    // Fetch users excluding the ids in excludeIds

    // Chunk the excludeIds into groups of 10
    console.log("chunking ids");
    const chunkedExcludeIds = [];
    for (let i = 0; i < excludeIds.length; i += 10) {
      chunkedExcludeIds.push(excludeIds.slice(i, i + 10));
    }

    const usersDataMap = new Map();
    const allQueriedUserIds = [];

    for (const idsChunk of chunkedExcludeIds) {
      console.log("filtering for each chunk");
      const chunkQuery = matchingUsersQuery
          .where(admin.firestore.FieldPath.documentId(), "not-in", idsChunk);

      const chunkSnapshot = await chunkQuery.get();
      chunkSnapshot.forEach((doc) => {
        const userData = doc.data();
        userData.id = doc.id;

        allQueriedUserIds.push(doc.id);
        usersDataMap.set(doc.id, userData);
      });
    }

    // Deduplicate all queried user IDs
    const uniqueQueriedUserIds = [...new Set(allQueriedUserIds)];

    // For each unique ID,
    // check if it appears in every chunked query.
    // If it does, it's a final user ID.
    const finalUserIds = uniqueQueriedUserIds.filter((id) => {
      let appearanceCount = 0;
      chunkedExcludeIds.forEach((chunk) => {
        if (!chunk.includes(id)) {
          appearanceCount++;
        }
      });
      return appearanceCount === chunkedExcludeIds.length;
    });

    // Retrieve user data from the previously stored map
    const uniqueUsers = finalUserIds.map((id) => usersDataMap.get(id));

    console.log("filtering out incomplete profiles");
    const completeUsers = uniqueUsers.filter((user) => {
      return user.mission !== null &&
        user.mission !== "" &&
        user.medals && user.medals.length === 3 &&
        user.images && user.images.length === 3;
    });

    console.log("limiting to 30 profiles or less");
    const finalUsers = completeUsers.length > 30 ?
      completeUsers.slice(0, 30) : completeUsers;

    res.status(200).json(finalUsers);
  } catch (error) {
    console.error("Error fetching filtered users: ", error);
    res.status(500).send("Internal Server Error");
  }
});


exports.sendAnnouncementNotification = functions.firestore
    .document("announcements/{announcementId}")
    .onCreate(async (snap, context) => {
      const CHUNK_SIZE = 500;
      const newData = snap.data();
      const announcementDoc = {
        id: snap.id,
        read: false,
        ...snap.data(),
      };

      const announcementId = context.params.announcementId;

      const tokens = [];

      const usersSnapshot = await admin.firestore()
          .collection("users").get();

      const users = usersSnapshot.docs;

      console.log("splitting users into chunks");

      // Split users into chunks
      const userChunks = [];
      for (let i = 0; i < users.length; i += CHUNK_SIZE) {
        userChunks.push(users.slice(i, i + CHUNK_SIZE));
      }

      console.log("cycling through each user chunk for announcements");

      for (const userChunk of userChunks) {
        const batch = admin.firestore().batch();

        userChunk.forEach((doc) => {
          const userID = doc.id;
          const userData = doc.data();

          const announcementRef = admin.firestore().collection("users")
              .doc(userID).collection("announcements").doc(announcementId);

          batch.set(announcementRef, announcementDoc);

          if (userData.token && userData.token !== "token" &&
          userData.token !== "not_granted") {
            tokens.push(userData.token);
          }
        });

        try {
          console.log("writing all the new announcements to users");
          await batch.commit();
        } catch (error) {
          console.error("Error adding announcement to users:", error);
        // Handle the error appropriately.
        // Maybe retry or notify you about the failure.
        }
      }

      if (tokens.length > 0) {
        try {
          console.log("sending batch notifications to users");
          return sendPushBatch(tokens, newData.title,
              newData.message, {type: "announcement"});
        } catch (error) {
          console.error("Error sending notifications:", error);
          // Handle the error appropriately.
          return null;
        }
      }
      return null;
    });


exports.sendAnnouncementNotificationDev = functions.firestore
    .document("announcements_test/{announcementId}")
    .onCreate(async (snap, context) => {
      const CHUNK_SIZE = 500;
      const newData = snap.data();
      const announcementDoc = {
        id: snap.id,
        read: false,
        ...snap.data(),
      };

      const announcementId = context.params.announcementId;

      const tokens = [];

      const usersSnapshot = await admin.firestore()
          .collection("users_test").get();

      const users = usersSnapshot.docs;

      console.log("splitting users into chunks");

      // Split users into chunks
      const userChunks = [];
      for (let i = 0; i < users.length; i += CHUNK_SIZE) {
        userChunks.push(users.slice(i, i + CHUNK_SIZE));
      }

      console.log("cycling through each user chunk for announcements");

      for (const userChunk of userChunks) {
        const batch = admin.firestore().batch();

        userChunk.forEach((doc) => {
          const userID = doc.id;
          const userData = doc.data();

          const announcementRef = admin.firestore().collection("users_test")
              .doc(userID).collection("announcements").doc(announcementId);

          batch.set(announcementRef, announcementDoc);

          if (userData.token && userData.token !== "token" &&
          userData.token !== "not_granted") {
            tokens.push(userData.token);
          }
        });

        try {
          console.log("writing all the new announcements to users");
          await batch.commit();
        } catch (error) {
          console.error("Error adding announcement to users:", error);
        // Handle the error appropriately.
        // Maybe retry or notify you about the failure.
        }
      }

      if (tokens.length > 0) {
        try {
          console.log("sending batch notifications to users");
          return sendPushBatch(tokens, newData.title,
              newData.message, {type: "announcement"});
        } catch (error) {
          console.error("Error sending notifications:", error);
          // Handle the error appropriately.
          return null;
        }
      }
      return null;
    });


functionCall.delete("/deleteUserDev/:id", async (req, res) => {
  console.log("Initiating delete...");

  const userId = req.params.id.replace(/:/g, "");
  // Get user id from query parameter
  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  console.log("delete called on", userId);

  const userDocRef = admin.firestore().collection("users_test").doc(userId);

  try {
    console.log("deleting collections");
    const collectionsToDelete = ["requests", "swipes", "passes"];
    for (const collection of collectionsToDelete) {
      const snapshot = await userDocRef.collection(collection).get();
      if (!snapshot.empty) {
        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        console.log("Deleted", collection);
      } else {
        console.log(`No documents found in ${collection}. Skipping deletion.`);
      }
    }

    // Delete the three images in storage
    console.log("deleting images");

    const bucket = admin.storage().bucket();

    const directoryPath = `images/${userId}/`;

    // List files in the directory
    const [files] = await bucket.getFiles({
      prefix: directoryPath,
    });

    // Delete each file
    for (const file of files) {
      console.log("deleting image",file)
      await file.delete();
    }

    // for (let i = 0; i < 3; i++) {
    //   const imagePath = `images/${userId}/${i}`;
    //   try {
    //     await bucket.file(imagePath).delete();
    //     console.log("Deleted image:", imagePath);
    //   } catch (err) {
    //     if (err.code === 404) {
    //       console.log(`Image not found: ${imagePath}. Skipping deletion.`);
    //     } else {
    //       console.error(`Error deleting image ${imagePath}:`, err);
    //     }
    //   }
    // }

    console.log("deleting user doc");

    // Delete the user document from 'users' collection
    await userDocRef.delete();

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send("Internal Server Error");
  }
});

exports.functionCall = functions.https.onRequest(functionCall);
