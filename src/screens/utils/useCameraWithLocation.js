import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, Alert, Linking, AppState } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { useTranslation } from 'react-i18next';

const useCameraWithLocation = () => {
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(null);
  const [canceledPermission, setCanceledPermission] = useState(null);
  const [PermissionError, setPermissionError] = useState('');
  const { t } = useTranslation();

  const timestamp = new Date();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);
  
    return () => {
      subscription.remove();
    };
  }, []);

  const openAppSettings = () => {
    Alert.alert(
      'Permissions Required',
      'Please enable permissions in the settings to use this feature.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // console.log('Settings canceled.');
            setIsCameraOpen(false); // Reset camera state
            setCanceledPermission(true);
          },
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings().then(() => {
              // console.log('Returning from settings. Rechecking permissions...');
              setTimeout(async () => {
                const granted = await checkPermissions();
                if (!granted) {
                  // console.log('Permissions still denied after settings.');
                  setIsCameraOpen(false); // Reset camera state
                }
              }, 1000); // Allow some delay for permissions update
            });
          },
        },
      ]
    );
  };
  
  
  useEffect(() => {
    let interval = null;
  
    if (isCameraOpen) {
      // console.log('Camera is open. Starting permission check interval...');
      interval = setInterval(async () => {
        const granted = await checkPermissions();
        if (!granted) {
          // console.log('Permissions revoked or not granted.');
          setIsCameraOpen(false); // Close camera if permissions are revoked
        }
      }, 1000);
    } else {
      // console.log('Camera is closed. Clearing intervals...');
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraOpen]);

  const checkPermissions = async () => {
    // console.log('Rechecking permissions...');
    const cameraStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    const locationStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  
    if (cameraStatus && locationStatus) {
      // console.log('Permissions are granted.');
      setIsCameraOpen(true); // Proceed to open the camera
      return true;
    } else {
      // console.warn('Permissions are not granted.');
      setIsCameraOpen(false);
      // showPermissionAlert();
      // openAppSettings();
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const cameraStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      const locationStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  
      if (!cameraStatus || !locationStatus) {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
  
        const locationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
  
        if (
          cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
          locationPermission === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          if (
            cameraPermission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
            locationPermission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
          ) {
            return false;
          }
          setIsCameraOpen(false); // Reset state for all outcomes
          return false;
        }
      }
      return true;
    } catch (err) {
      // console.log('Error requesting permissions:', err);
      setIsCameraOpen(false); // Ensure state update on error
      return false;
    }
  }; 

  const capturePhotoWithLocation = async () => {
    try {
      const permissionsGranted = await requestPermissions();

      if (!permissionsGranted) {
        setIsCameraOpen(false);
        console.warn('Permissions not granted');
        // showPermissionAlert();
        openAppSettings();
        return null;
      }
  
      setIsCameraOpen(true); // Camera is now open
  
      const response = await launchCameraAsync();

      // const position = await getCurrentPosition().catch((err) => {
      // console.warn('Location fetch failed, continuing without location', err);
      // return null;
      // });
  
      if (response.didCancel) {
        // console.log('User cancelled image picker');
        setIsCameraOpen(false);
        setPhotoUri(null);
        setLocation(null);
        return null;
      }
      if (response.errorCode) {
        // console.log('ImagePicker Error: ', response.errorMessage);
        setIsCameraOpen(false);
        setPhotoUri(null);
        setLocation(null);
        return null;
      }
  
      const { uri } = response.assets[0];
      setPhotoUri(uri);
      // setLocation({
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude,
      // });
  
      setIsCameraOpen(false);
  
      // const editedUri = await addTextToImage(uri, position.coords);
      // await saveToStorage(editedUri);
      // console.log('Edited photo URI:', editedUri);
      setPermissionError('');

         return {
      photoUri: uri,
      // location: {
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude,
      // },
      // timestamp: Util.formatDate(new Date())
      timestamp: new Date().toLocaleString()
    };
    } catch (error) {
      // console.log('Error capturing photo:', error);
      resetCameraState();
      // console.warn('Permission Error:', 'Please check and enable the required permissions.');
      const p_msg = t('location_error');
      setPermissionError(p_msg);
      setTimeout(() => {
        setPermissionError(''); // Clear the error after 10 seconds
      }, 10000);
      return null;
    }
  };

  const captureLocationOnly = async () => {
  try {
    const permissionsGranted = await requestPermissions();

    if (!permissionsGranted) {
      setIsCameraOpen(false);
      console.warn('Permissions not granted for location');
      openAppSettings();
      return null;
    }

    const position = await getCurrentPosition().catch((err) => {
      console.warn('Location fetch failed, continuing without location', err);
      return null;
      });

    const locData = {
      photoUri: null,
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      timestamp: new Date().toLocaleString(),
    };

    setLocation(locData.location);

    return locData;
  } catch (error) {
    console.log("Error capturing location only:", error);
    setPermissionError('Unable to fetch location.');
    setTimeout(() => setPermissionError(''), 5000);
    return null;
  }
};

  const resetCameraState = () => {
    setIsCameraOpen(false);
    setPhotoUri(null);
    setLocation(null);
  };
  
  
  const getCurrentPosition = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Request fine location permission first
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
 
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Try fetching fine location (high accuracy)
          Geolocation.getCurrentPosition(
            resolve,
            async (error) => {
              
              if (error.code === 2) { // Location unavailable
                // console.warn('Location services unavailable. Please enable GPS.');
                // showPermissionAlert();
                openAppSettings();
              }
 
              // Check if the error is timeout or related to unavailable GPS
              if (error.code === 3) { // Timeout
                // console.log('Switching to coarse location as fallback...');
                const coarseGranted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
                );
 
                if (coarseGranted === PermissionsAndroid.RESULTS.GRANTED) {
                  // Retry with coarse location
                  Geolocation.getCurrentPosition(
                    resolve,
                    (err) => {
                      reject(err);
                    },
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 8000 }
                  );
                } else {
                  reject(new Error('Coarse location permission denied'));
                }
              } else {
                reject(error); // Other errors
              }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 8000 }
          );
        } else {
          reject(new Error('Fine location permission denied'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };
 

  const launchCameraAsync = () => {
    return new Promise((resolve, reject) => {
      launchCamera({ mediaType: 'photo', quality: 0.5 }, (response) => {
        if (response.didCancel) {
          resolve({ didCancel: true });
        } else if (response.errorCode) {
          reject(new Error(response.errorMessage));
        } else {
          resolve(response);
        }
      });
    });
  };

  return { 
    capturePhotoWithLocation, 
    captureLocationOnly,
    photoUri, 
    location, 
    setPhotoUri, 
    setLocation, 
    isCameraOpen, 
    timestamp, 
    canceledPermission, 
    PermissionError };
};

export default useCameraWithLocation;
