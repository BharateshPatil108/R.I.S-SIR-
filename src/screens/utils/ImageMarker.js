// import ImageMarker from 'react-native-image-marker';

// const addTimestampOverlay = async (imageUri, timestamp, location) => {
//   try {
//     if (!imageUri) {
//       throw new Error('No image URI provided');
//     }

//     // Format the text for overlay
//     const locationText = location 
//       ? `Lat: ${location.latitude.toFixed(6)}\nLon: ${location.longitude.toFixed(6)}`
//       : 'Location: N/A';
    
//     const overlayText = `${timestamp}\n${locationText}`;

//     // Add text overlay to the image
//     const markedImageUri = await ImageMarker.markText({
//       src: imageUri,
//       text: overlayText,
//       position: 'bottomLeft', // Position at bottom left
//       color: '#FFFFFF', // White text
//       fontName: 'Arial',
//       fontSize: 16,
//       scale: 1,
//       quality: 100,
//       background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
//     });

//     return markedImageUri;

//   } catch (error) {
//     console.log('Error adding timestamp overlay:', error);
//     // Return original image if overlay fails
//     return imageUri;
//   }
// };

// export default addTimestampOverlay;