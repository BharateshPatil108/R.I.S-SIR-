// import { useRef, useState } from 'react';
// import useCameraWithLocation from '../utils/useCameraWithLocation';

// const useMultiCamera = () => {
//   const cameraRefs = useRef({});
//   const [cameraData, setCameraData] = useState({});

//   const { capturePhotoWithLocation } = useCameraWithLocation();

//   const getCameraInstance = (key) => {
//     if (!cameraRefs.current[key]) {
//       cameraRefs.current[key] = {
//         capture: async () => {
//           const result = await capturePhotoWithLocation();
//           setCameraData((prev) => ({
//             ...prev,
//             [key]: result,
//           }));
//           return result;
//         },
//         data: null,
//       };
//     }
//     return cameraRefs.current[key];
//   };

//   const capturePhotoForField = async (fieldKey, index) => {
//     const key = `${fieldKey}_${index}`;
//     const cameraInstance = getCameraInstance(key);
//     return await cameraInstance.capture();
//   };

//   const getPhotoData = (fieldKey, index) => {
//     const key = `${fieldKey}_${index}`;
//     return cameraData[key] || null;
//   };

//   return {
//     capturePhotoForField,
//     getPhotoData,
//     cameraData,
//   };
// };

// export default useMultiCamera;


import { useRef, useState } from 'react';
import useCameraWithLocation from '../utils/useCameraWithLocation';

const useMultiCamera = () => {
  const cameraRefs = useRef({});
  const [cameraData, setCameraData] = useState({});

  const { capturePhotoWithLocation } = useCameraWithLocation();

  const capturePhotoForField = async (fieldKey, index) => {
    try {
      const key = `${fieldKey}_${index}`;
      
      console.log(`Capturing photo for: ${key}`);
      
      const result = await capturePhotoWithLocation();
      
      if (!result) {
        console.log('No result from camera capture');
        return null;
      }

      console.log('Camera result:', result);

      // Create timestamp here if not provided by camera hook
      const timestamp = new Date().toLocaleString();
      
      // Update camera data with the result
      setCameraData(prev => ({
        ...prev,
        [key]: {
          ...result,
          fieldKey,
          index,
          timestamp: result.timestamp || timestamp // Use provided timestamp or create new one
        }
      }));

      return {
        ...result,
        fieldKey,
        index,
        timestamp: result.timestamp || timestamp
      };

    } catch (error) {
      console.log('Error in capturePhotoForField:', error);
      return null;
    }
  };

  const getPhotoData = (fieldKey, index) => {
    const key = `${fieldKey}_${index}`;
    return cameraData[key] || null;
  };

  const clearPhotoData = (fieldKey, index) => {
    const key = `${fieldKey}_${index}`;
    setCameraData(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  return {
    capturePhotoForField,
    getPhotoData,
    cameraData,
    clearPhotoData,
    setCameraData
  };
};

export default useMultiCamera;