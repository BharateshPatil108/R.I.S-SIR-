import React, { useState, useEffect, useRef } from 'react';
import LoginPresentational from '../presentational/LoginPresentational';
import { useNavigation } from '@react-navigation/native';
import { Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import * as LoginActions from '../../actions/LoginActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../utils/i18n';
import { getOtpSession, clearOtpSession, createOtpTable } from '../../offlineDataBase/LogInDB';
import { getDBConnection } from '../../offlineDataBase/DBcreation';
import { useUser } from '../utils/UserProvider';

const LoginContainer = (props) => {
  const navigation = useNavigation();
  const { isNetPresent } = useUser();
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [nameError, setNameError] = useState('');
  const [mobError, setMobError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const loginTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
// useEffect(() => {
//     const checkExistingSession = async () => {
//       if (mobileNumber?.length < 15) {
//         try {
//           const db = await getDBConnection();
//           await createOtpTable(db);
//           const session = await getOtpSession(db, mobileNumber);
          
//           if (session) {
//             const now = new Date();
//             const expiry = new Date(session.expiryDate);
            
//             if (now <= expiry && session.token) {
//               // Valid session exists - navigate to OTP screen
//               navigation.navigate('otpVerify', { mobileNumber });
//             } else {
//               // Session expired - clear it
//               await clearOtpSession(db, mobileNumber);
//             }
//           }
//         } catch (error) {
//           console.log("Session check error:", error);
//         }
//       }
//     };
    
//     // Add a slight delay to avoid checking on every keystroke
//     const timeoutId = setTimeout(() => {
//       checkExistingSession();
//     }, 500);
    
//     return () => clearTimeout(timeoutId);
//   }, [mobileNumber]);

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'kn' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    await AsyncStorage.setItem('appLanguage', newLanguage);
  };

  useEffect(() => {
    const loadLanguagePreference = async () => {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
        setCurrentLanguage(savedLanguage);
      }
    };
    loadLanguagePreference();
  }, [currentLanguage]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert("", "Are you sure you want to exit?", [
          { text: 'Cancel', style: "cancel" },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const handleSendOTP = async () => {

    // if (!name.trim()) {
    //   setNameError('Please enter your name');
    //   valid = false;
    //   return;
    // } else {
    //   setNameError('');
    // }

    if (!mobileNumber.trim() || mobileNumber.length > 15 || mobileNumber.length < 6) {
      setMobError('Please enter a valid less than 15-digit and greater then 6-digit UserName / Mobile Number');
      valid = false;
      return;
    } else {
      setMobError('');
    }

      setLoading(true);
      setIsTimeout(false);

      if(!isNetPresent){
        try {
          const db = await getDBConnection();
          await createOtpTable(db);

          // 🔍 Check offline DB first
          const session = await getOtpSession(db, mobileNumber);

          if (session) {
            const now = new Date();
            const expiry = new Date(session.expiryDate);
          
            if (now <= expiry) {
              // ✅ OTP still valid → go to OTP verify screen
              navigation.navigate('otpVerify', { mobileNumber });
               setLoading(false);
              return;
            } else {
              // ❌ OTP expired → clear and continue normal login
              await clearOtpSession(db, session.mobile);
              Alert.alert("ODP expired", "Please request a new ODP");
            }
          }
        } catch (error) {
          console.log("DB check failed:", error);
          Alert.alert("Error", "Something went wrong with offline check");
        }
      }

      abortControllerRef.current = new AbortController();
      const fields = { userName: mobileNumber };

      props.userLogin(fields, abortControllerRef.current);
      startLoginTimeout();

  };

  const startLoginTimeout = () => {
    clearLoginTimeout();

    loginTimeoutRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsTimeout(true);
      setLoading(false);
      Alert.alert("Request Timeout", "Please try again.");
    }, 60000);
  };

  const clearLoginTimeout = () => {
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (props.isLoginSuccess) {
      clearLoginTimeout();
      setLoading(false);
      const statusCode = props.loginModel?.statusCode;
      const message = props.loginModel?.message;

      if(statusCode === 200) {
        Alert.alert('Login success', `${message} to ${mobileNumber}`);

        navigation.navigate('otpVerify', {
        mobileNumber: mobileNumber
      });
      } else if(statusCode === 203) {
        Alert.alert('Check Mobile Number', `${message}`);
      } else if(statusCode === 401) {
        Alert.alert('Invalid Credential!', `${message}`);
      }
      props.setLoginSuccess();
    }
  }, [props.isLoginSuccess]);

  useEffect(() => {
  const handleLoginError = async () => {
    if(props.loginError){
      clearLoginTimeout();
      setLoading(false);

        if (props.loginError === "Failed to connect to /49.204.72.5:8080") {
          try {
            const db = await getDBConnection();
            const session = await getOtpSession(db, mobileNumber);

            if (session) {
              const now = new Date();
              const expiry = new Date(session.expiryDate);

              if (now <= expiry) {
                Alert.alert("Offline Mode", "Network issue detected, using saved OTP");
                navigation.navigate('otpVerify', { mobileNumber });
                return;
              }
            }
            Alert.alert("Login Failed", "Please check internet connection!");
          } catch (offlineErr) {
            console.log("Offline fallback failed:", offlineErr);
            Alert.alert("Login Failed", "Please check internet connection!");
          }
        } else {
          Alert.alert(
            "Login Failed",
            props.loginError.message || "Something went wrong, please try again!"
          );
        }
      props.setLoginError();
    }
  };

  handleLoginError();
}, [props.loginError]);

  return (
    <LoginPresentational 
      name={name}
      setName={setName}
      mobileNumber={mobileNumber}
      setMobileNumber={setMobileNumber}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      countryCode={countryCode}
      nameError={nameError}
      mobError={mobError}
      setCountryCode={setCountryCode}
      handleSendOTP={handleSendOTP}
      loading={loading}
      toggleLanguage={toggleLanguage}
    />
  );
};

function mapStateToProps(state) {
  return {
    loginModel: state.login.loginModel,
    isLogingIn: state.login.isLogingIn,
    isLoginSuccess: state.login.isLoginSuccess,
    loginError: state.login.loginError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogin: (fields, controller) => dispatch(LoginActions.userLogin(fields, controller)),
    setLoginSuccess: () => dispatch(LoginActions.setLoginSuccess()),
    setLoginError: () => dispatch(LoginActions.setLoginError()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
