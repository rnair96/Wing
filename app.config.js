require('dotenv').config();

export default {
  expo: {
    name: "Wing",
    slug: "mission_partner",
    version: "2.2.5",
    orientation: "portrait",
    icon: "./assets/wing_icon.png",
    userInterfaceStyle: "light",
    scheme: "com.googleusercontent.apps.597753804912-dspeqvn4dblne96m842pgfiu4a66kha2", // Assuming this is what you meant by scheme
    splash: {
      image: "./assets/splash_wing.png",
      resizeMode: "contain",
      backgroundColor:"#00BFFF"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.wingcommunity.wing",
      infoPlist: {
        UIApplicationSceneManifest: {
          UIApplicationSupportsMultipleScenes: false,
          UISceneConfigurations: {}
        },
        NSLocationWhenInUseUsageDescription: "This app needs access to your location to match with users near you.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "This app needs access to your location even when you’re not using the app so that users near you can match with you."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      package: process.env.ANDROID_CLIENT_ID
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends."
        }
      ],
      "expo-build-properties",
      "expo-updates",
      "expo-apple-authentication"
    ],
    extra: {
      eas: {
        projectId: "5c4bf1ec-66df-4386-bed0-abf7b2bf19db"
      },
      runtimeVersion: {
        policy: "appVersion"
      },
      androidClientId: process.env.ANDROID_CLIENT_ID,
      iosClientId: process.env.IOS_CLIENT_ID,
      expoClientId: process.env.EXPO_CLIENT_ID,
      projectName: process.env.PROJECT_NAME,
      sentryId: process.env.SENTRY_ID,
      chatGptKey: process.env.CHATGPT_KEY,
      emailJsService: process.env.EMAILJS_SERVICE,
      emailJsTemplate: process.env.EMAILJS_TEMPLATE,
      emailJsKey: process.env.EMAILJS_KEY,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAppId: process.env.FIREBASE_APPID,
      firebaseAuthDomain: process.env.FIREBASE_AUTHDOMAIN,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSENGINGSENDERID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENTID,
      firebaseProjectId: process.env.FIREBASE_PROJECTID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGEBUCKET,
      prodUsers: process.env.PROD_USERS,
      devUsers: process.env.DEV_USERS,
      prodMatches: process.env.PROD_MATCHES,
      devMatches: process.env.DEV_MATCHES,
      prodAnnouncements: process.env.PROD_ANNOUNCEMENTS,
      devAnnouncements: process.env.DEV_ANNOUNCEMENTS,
      prodFetchCards: process.env.PROD_FETCHCARDS,
      devFetchCards: process.env.DEV_FETCHCARDS,
      masterAccount: process.env.MASTER_ACCOUNT,
      masterAccount2: process.env.MASTER_ACCOUNT2,
      prodDeleteUser: process.env.PROD_DELETEUSER,
      devDeleteUser: process.env.DEV_DELETEUSER
    }
  }
};
