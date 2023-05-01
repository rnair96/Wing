// import { ImageAnnotatorClient } from '@google-cloud/vision';
// import * as FileSystem from 'expo-file-system';

// const client = new ImageAnnotatorClient({
//   keyFilename: './keys/your-google-cloud-api.json',
// });

// const checkInappropriateContent = async (imageUri) => {
//   const base64Image = await FileSystem.readAsStringAsync(imageUri, {
//     encoding: FileSystem.EncodingType.Base64,
//   });

//   const request = {
//     image: {
//       content: base64Image,
//     },
//     features: [
//       {
//         type: 'SAFE_SEARCH_DETECTION',
//       },
//     ],
//   };

//   try {
//     const [response] = await client.annotateImage(request);
//     const safeSearch = response.safeSearchAnnotation;

//     if (
//       safeSearch.adult === 'LIKELY' ||
//       safeSearch.adult === 'VERY_LIKELY' ||
//       safeSearch.violence === 'LIKELY' ||
//       safeSearch.violence === 'VERY_LIKELY' ||
//       safeSearch.racy === 'LIKELY' ||
//       safeSearch.racy === 'VERY_LIKELY'
//     ) {
//       return false; // inappropriate content
//     } else {
//       return true; // appropriate content
//     }
//   } catch (error) {
//     console.error('Error checking image content:', error);
//     return false;
//   }
// };

// export default checkInappropriateContent;
