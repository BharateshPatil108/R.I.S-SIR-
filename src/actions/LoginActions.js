import { APIs } from '../constants/Api_Constants';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

// login
// export const userLogin = (fields) => {
//   console.log(fields)
//   return (dispatch) => {
//     dispatch({ type: 'LOGIN_START' });
//     console.log(`${APIs}/api/Authentication/request-otp`, fields);

//     axios.post(APIs + '/api/Authentication/request-otp', fields, { timeout: 60000 })
//       .then(function (response) {
//         dispatch({ type: 'LOGIN_SUCCESS', payload: response.data })
//         console.log("response :- ", response.data);
//       }).catch(function (error) {
//         if (error.code === 'ECONNABORTED') {
//           console.log("⏱️ Request Timeout");
//         }
//         dispatch({ type: 'LOGIN_FAILURE', payload: error })
//         console.log("LogIn Error :- ", error.message);
//       })
//   }
// }

export const userLogin = (fields) => {
    // console.log(fields);
    return async (dispatch) => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await RNFetchBlob.config({
                trusty: true, // ✅ Ignore SSL certificate errors
            }).fetch('POST', `${APIs}/api/Authentication/request-otp`, {
                'Content-Type': 'application/json',
            }, JSON.stringify(fields));
        
            // 🔹 Log the raw response before parsing
            const rawResponse = await response.text();
            console.log("📢 Raw API Response:", rawResponse.substring(0, 200)); // Print first 200 chars
        
            // 🔹 Check if response is JSON
            try {
                const data = JSON.parse(rawResponse);
            
                if (data.token) {
                    await AsyncStorage.setItem('userToken', data.token);
                } else {
                    // console.log("🚨 No valid token received, skipping storage.");
                }
            
                dispatch({ type: 'LOGIN_SUCCESS', payload: data });
                console.log('✅ Login Successful:', data);
            } catch (parseError) {
                // console.log("🚨 JSON Parse Error:", parseError);
                dispatch({ type: 'LOGIN_FAILURE', payload: "Invalid JSON Response" });
            }            
        } catch (error) {
            console.log('🚨 API Fetch Error:', error.message);
            dispatch({ type: 'LOGIN_FAILURE', payload: error.message || "Unknown error" });
        } 
    };
};


// Reset Login Success State
export const setLoginSuccess = () => (dispatch) => {
    dispatch({ type: 'SET_IS_LOGIN_SUCCESS' });
};

// Reset Login Error State
export const setLoginError = () => (dispatch) => {
    dispatch({ type: 'SET_LOGIN_ERROR' });
};

// otp verify
export const OtpVerify = (fields) => {
  console.log(fields);
  return async (dispatch) => {
    dispatch({ type: 'OTP_VERIFY_START' });

    try {
      const url = `${APIs}/api/Authentication/verify-otp`;
      console.log("📡 OtpVerify URL:", url, "Fields:", fields);

      const response = await RNFetchBlob.config({ trusty: true }).fetch(
        'POST',
        url,
        { 'Content-Type': 'application/json' },
        JSON.stringify(fields)
      );

      const rawResponse = await response.text();
      console.log("📢 Raw OTP Verify Response:", rawResponse);

      if (!rawResponse || !rawResponse.trim().startsWith('{')) {
        console.log("🚨 Non-JSON or empty response from server");
        dispatch({ type: 'OTP_VERIFY_FAILURE', payload: "Invalid server response" });
        return;
      }

      const data = JSON.parse(rawResponse);

      // ✅ Save token if available
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
      }

      dispatch({ type: 'OTP_VERIFY_SUCCESS', payload: data });
      console.log("✅ OTP Verify Success:", data);
    } catch (error) {
      console.log("🚨 OTP Verify Error:", error);
      dispatch({ type: 'OTP_VERIFY_FAILURE', payload: error.message || "Unknown error" });
    }
  };
};

// reset success
export const setOtpVerifySuccess = () => (dispatch) => {
  dispatch({ type: 'SET_IS_OTP_VERIFY_SUCCESS' });
};

// reset error
export const setOtpVerifyError = () => (dispatch) => {
  dispatch({ type: 'SET_IS_OTP_VERIFY_ERROR' });
};
