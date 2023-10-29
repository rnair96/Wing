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

// async function verifyToken(req) {
//   const authHeader = req.headers.authorization || "";
//   const match = authHeader.match(/Bearer (.+)/);

//   if (!match) {
//     throw new Error("No ID token provided");
//   }

//   const idToken = match[1];

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     return decodedToken.uid;
//   } catch (error) {
//     throw new Error("Invalid ID token");
//   }
// }

exports.onSwipe = functions.firestore
    .document("users/{userId}/swipes/{swipeId}")
    .onCreate(async (snap, context) => {
      console.log("swipe initiated");


      // Get the ID of the user who was swiped on
      const isResponse = snap.data().isResponse;
      const masterUid = functions.config().wing.master_uid;

      // Get the ID of the user who was swiped on
      const swipedUserId = snap.data().id;

      console.log("master Uid", masterUid);
      console.log("swiped user id", swipedUserId);
      console.log("isResponse", isResponse);

      // if responding to my chat request
      if (isResponse && swipedUserId === masterUid) {
        console.log("handling reply after matching with CEO");

        // set reply
        const masterName = functions.config().wing.master_name;
        const matchId = snap.data().match_id;

        const newTime = new Date(Date.now());

        const reply =
        `Hey man, glad to match with you!\n\n This is an auto-reply but this is my personal line where I try to read and respond to ALL DMS. So feel free to share any questions, concerns, or thoughts in general you may have about the app and this community right here.\n\n I may also drop a message in to see how you're doing and how we can make your experience even better. That's my mission after all ;)\n\n So keep your eye out for a surprise message from me and have fun Winging!`;

        const replyDoc = {
          timestamp: newTime,
          userId: masterUid,
          displayName: masterName,
          message: reply,
          read: false,
        };

        const replyRef = admin.firestore().collection("matches")
            .doc(matchId).collection("messages");

        replyRef.add(replyDoc);
        // add notification?
        console.log("reply added");
        return;
      } else if (isResponse) {
        console.log("The latest swipe is a response and not a request.");
        return;
      }


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

      const userSwipedDoc = admin.firestore().collection("users")
          .doc(swipedUserId);

      const userSwipingDoc = admin.firestore().collection("users")
          .doc(swiperId);

      const userSwipedSnapshot = await userSwipedDoc.get();
      const userSwipingSnapshot = await userSwipingDoc.get();

      if (!userSwipedSnapshot.exists || !userSwipingSnapshot.exists) {
        console.log("Given user not found");
        return;
      }

      const swipedUser = userSwipedSnapshot.data();

      const swipingUser = userSwipingSnapshot.data();

      // push notification to swiped user
      if (swipedUser.notifications &&
        swipedUser.notifications.messages &&
        swipedUser.token && swipedUser.token !== "testing" &&
        swipedUser.token !== "not_granted") {
        const messageDetails = {
          "requestDetails": request,
          "otherProfile": swipingUser,
          // "profile": swipedUser,
        };

        console.log("sending push notification to swiped user", swipedUserId);
        // console.log("sending message details", messageDetails);
        console.log("sending request message from", swipingUser.displayName);
        console.log("sending request message to token", swipedUser.token);


        sendPush(swipedUser.token, `New Request from ${swipingUser.displayName}`,
            message, {type: "request", message: messageDetails});
      }
      console.log("setting request doc");

      return requestsRef.set(request);
    });


exports.onSwipeDev = functions.firestore
    .document("users_test/{userId}/swipes/{swipeId}")
    .onCreate(async (snap, context) => {
      console.log("swipe dev initiated");
      const isResponse = snap.data().isResponse;

      const masterUid = functions.config().wing.master_uid;

      // Get the ID of the user who was swiped on
      const swipedUserId = snap.data().id;

      // if responding to my chat request
      if (isResponse && swipedUserId === masterUid) {
        console.log("handling reply after matching with CEO");

        // set reply
        const masterName = functions.config().wing.master_name;
        const matchId = snap.data().match_id;

        const newTime = new Date(Date.now());

        const reply =
        `Hey man, glad to match with you!\n\n This is an auto-reply but this is my personal line where I try to read and respond to ALL DMS. So feel free to share any questions, concerns, or thoughts in general you may have about the app and this community right here.\n\n I may also drop a message in to see how you're doing and how we can make your experience even better. That's my mission after all ;)\n\n So keep your eye out for a surprise message from me and have fun Winging!`;

        const replyDoc = {
          timestamp: newTime,
          userId: masterUid,
          displayName: masterName,
          message: reply,
          read: false,
        };

        const replyRef = admin.firestore().collection("matches_test")
            .doc(matchId).collection("messages");

        replyRef.add(replyDoc);
        // add notification?
        console.log("reply added");
        return;
      } else if (isResponse) {
        console.log("The latest swipe is a response and not a request.");
        return;
      }


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

      const userSwipedDoc = admin.firestore().collection("users_test")
          .doc(swipedUserId);

      const userSwipingDoc = admin.firestore().collection("users_test")
          .doc(swiperId);

      const userSwipedSnapshot = await userSwipedDoc.get();
      const userSwipingSnapshot = await userSwipingDoc.get();

      if (!userSwipedSnapshot.exists || !userSwipingSnapshot.exists) {
        console.log("Given user not found");
        return;
      }

      const swipedUser = userSwipedSnapshot.data();

      const swipingUser = userSwipingSnapshot.data();

      if (swipedUser.notifications &&
        swipedUser.notifications.messages &&
        swipedUser.token && swipedUser.token !== "testing" &&
        swipedUser.token !== "not_granted") {
      // add if user gave permission for request notifications
        const messageDetails = {
          "requestDetails": request,
          "otherProfile": swipingUser,
          // "profile": swipedUser,
        };

        console.log("sending push notification to swiped user", swipedUserId);
        // console.log("sending message details", messageDetails);
        console.log("sending request message from", swipingUser.displayName);
        console.log("sending request message to token", swipedUser.token);


        sendPush(swipedUser.token, `New Request from ${swipingUser.displayName}`,
            message, {type: "request", message: messageDetails});
      }
      console.log("setting request doc");

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
    const masterUid = functions.config().wing.master_uid;

    const excludeIds = [userId, masterUid]; // Start by excluding the user and CEO themselves

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
        user.values && user.values.length === 3 &&
        user.images && user.images.length === 3 &&
        (!user.flagged_status || user.flagged_status === "none" || user.flagged_status === "resolved");
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

  // try {
  //   console.log("verifying token");
  //   const userId = await verifyToken(req);
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
    const masterUid = functions.config().wing.master_uid;

    const excludeIds = [userId, masterUid]; // Start by excluding the user and CEO themselves

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

    console.log("filtering out incomplete profiles and flagged accounts");

    const completeUsers = uniqueUsers.filter((user) => {
      return user.mission !== null &&
        user.mission !== "" &&
        user.values && user.values.length === 3 &&
        user.images && user.images.length === 3 &&
        (!user.flagged_status || user.flagged_status === "none" || user.flagged_status === "resolved");
    });

    console.log("limiting to 30 profiles or less");
    const finalUsers = completeUsers.length > 30 ?
      completeUsers.slice(0, 30) : completeUsers;

    res.status(200).json(finalUsers);
  } catch (error) {
    console.error("Error fetching filtered users: ", error);
    res.status(500).send("Internal Server Error");
  }
  // } catch (error) {
  //   console.error("Authentication error", error);
  //   res.status(401).send("Unauthorized");
  //   return;
  // }
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

          if (userData.notifications &&
          userData.notifications.events &&
          userData.token && userData.token !== "testing" &&
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

          if (userData.notifications &&
          userData.notifications.events &&
          userData.token && userData.token !== "testing" &&
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
      console.log("deleting image", file);
      await file.delete();
    }

    console.log("deleting user doc");

    // Delete the user document from 'users' collection
    await userDocRef.delete().then(() => {
      console.log("user doc deleted, deleting user auth");
    });

    await admin.auth().deleteUser(userId)
        .then(() => {
          console.log("Successfully deleted user auth");
        });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send("Internal Server Error");
  }
});

functionCall.delete("/deleteUser/:id", async (req, res) => {
  console.log("Initiating delete in production...");

  const userId = req.params.id.replace(/:/g, "");
  // Get user id from query parameter
  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  console.log("delete called on", userId);

  const userDocRef = admin.firestore().collection("users").doc(userId);

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
      console.log("deleting image", file);
      await file.delete();
    }

    console.log("deleting user doc");

    // Delete the user document from 'users' collection

    await userDocRef.delete().then(() => {
      console.log("user doc deleted, deleting user auth");
    });

    await admin.auth().deleteUser(userId)
        .then(() => {
          console.log("Successfully deleted user auth");
        });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send("Internal Server Error");
  }
});

exports.functionCall = functions.https.onRequest(functionCall);
