// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { APIs } from '../../constants/Api_Constants';

// // Create Axios instance
// const axiosInstance = axios.create({
//   baseURL: APIs, // your API base URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor to include token
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor (optional)
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Axios already parses JSON automatically
//     return response.data; 
//   },
//   (error) => {
//     console.log('Axios API Error:', error.message || error);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIs } from '../../constants/Api_Constants';

// ✅ Make sure you're exporting as a function, not an object
export const axiosInstance = async (url, method = 'GET', data = null) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const fullUrl = `${APIs}${url}`;
    console.log(`📢 API Request: ${method} ${fullUrl}`, data ? data : '');

    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // RNFetchBlob expects body for POST/PUT/PATCH as string
    const body =
      data &&
      ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())
        ? JSON.stringify(data)
        : undefined;

    // Make request with SSL bypass (trusty: true)
    const response = await RNFetchBlob.config({ trusty: true, responseType: 'text' }).fetch(
      method,
      fullUrl,
      headers,
      body,
    );

    // Get raw response text
    const rawResponse = await response.text();

    // Try parse JSON
    try {
      return JSON.parse(rawResponse);
    } catch (e) {
      // Not JSON — return raw text
      return rawResponse;
    }
  } catch (error) {
    console.log('RNFetchBlob API Error:', error);
    throw new Error(error.message || 'Network request failed');
  }
};

// ✅ Export as default function (alternative approach)
export default axiosInstance;