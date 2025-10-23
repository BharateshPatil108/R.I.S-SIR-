import React, { useState, useEffect, useRef } from 'react';
import OtpVerificationPresentational from '../presentational/OtpVerificationPresentational';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import * as LoginActions from '../../actions/LoginActions';
import { useUser } from '../utils/UserProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { createOtpTable, clearOtpSession, saveOtpSession, getOtpSession } from '../../offlineDataBase/LogInDB';
import { getDBConnection } from '../../offlineDataBase/DBcreation';

const OtpVerificationContainer = (props) => {
    const route = useRoute();
    const navigation = useNavigation();
    const { mobileNumber, userName } = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const otpInputs = useRef([]);
    const [loading, setLoading] = useState(false);
    const { setToken, setDecodedToken, isNetPresent } = useUser();
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (timer > 0) {
          const interval = setInterval(() => {
            setTimer(prev => prev - 1);
          }, 1000);
          return () => clearInterval(interval);
        } else {
          setIsResendEnabled(true);
        }
      }, [timer]);
    
      const focusNext = (index, value) => {
        if (value && index < 5) {
          otpInputs.current[index + 1].focus();
        }
      };
    
      const focusPrevious = (index, key) => {
        if (key === 'Backspace' && index > 0) {
          otpInputs.current[index - 1].focus();
        }
      };
    
      const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        focusNext(index, text);
      };
    
      // const handleVerifyOtp = () => {
      //   const enteredOtp = otp.join('');
      //   if (enteredOtp.length !== 6) {
      //     Alert.alert('Error', 'Please enter complete OTP');
      //     return;
      //   }
      //   const fields = {
      //     userName: mobileNumber,
      //     otp: enteredOtp,
      //   }
      //   setLoading(true);
      //   props.OtpVerify(fields);
        
      // };

    const handleVerifyOtp = async () => {
      const enteredOtp = otp.join('');
      if (enteredOtp.length !== 6) {
        Alert.alert('Error', 'Please enter complete ODP');
        return;
      }
    
      setLoading(true);
      try {

      if(!isNetPresent) {
        const db = await getDBConnection();
        await createOtpTable(db);
      
        // 🔍 Check offline OTP
        const session = await getOtpSession(db, mobileNumber);
      
        if (session) {
          const now = new Date();
          const expiry = new Date(session.expiryDate);
        
          if (now <= expiry) {
          
            console.log("otp's:-",enteredOtp, session.otp);
            if (session.otp === enteredOtp) {
              
                setTimeout(() => {
                    Alert.alert('Success', 'ODP verified successfully (offline)!');
                }, 0);
              
              if (session.token) {
                setToken(session.token);
                const decodedToken = jwtDecode(session.token);
                setDecodedToken(decodedToken);
                await AsyncStorage.setItem('userToken', session.token);
              }
            
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Dashboard' }],
                })
              );
              setLoading(false);
              return; // exit here → don’t call API
            } else {
              Alert.alert('Invalid ODP', 'Entered ODP does not match');
              setLoading(false);
              return;
            }
          } else {
            // expired → clear session
            await clearOtpSession(db, mobileNumber);
            Alert.alert('ODP expired', 'Please request a new ODP');
             setLoading(false);
            return;
          }
        }
      } else {
        // 🔽 If no offline OTP found → go with API
        const fields = {
          userName: mobileNumber,
          otp: enteredOtp,
        };
        setLoading(true);
        abortControllerRef.current = new AbortController();
        props.OtpVerify(fields, abortControllerRef.current);
      }
      
      } catch (error) {
        console.log("Offline ODP check failed:", error);
        Alert.alert("Error", "Something went wrong during offline check");
        setLoading(false);
      }
    };

      useEffect(() => {
          if (props.otpVerifySuccess) {
            setLoading(false);

          console.log("otp verify response:-", props.otpVerifyModel);
          const statusCode = props.otpVerifyModel?.statusCode;
          const message = props.otpVerifyModel?.message;

          if(statusCode === 200){
            const tokenAxiosInstance = props.otpVerifyModel?.data?.token;
          setToken(tokenAxiosInstance);
          const decodedToken = jwtDecode(tokenAxiosInstance);
          
          setDecodedToken(decodedToken);

          console.log('decodedToken:- ',decodedToken);

          AsyncStorage.setItem('userToken', tokenAxiosInstance)
          .then(() => {
            console.log('Token stored successfully');
          })
          .catch((error) => {
            console.log("Error storing token:", error);
          });

            // calculate expiry (end of the day)
          const expiryDate = new Date();
          expiryDate.setHours(23,59,59,999);

          // save into SQLite
          (async () => {
              const db = await getDBConnection();
              await createOtpTable(db);
              await clearOtpSession(db, mobileNumber); // clear old
              await saveOtpSession(db, mobileNumber, otp.join(''), tokenAxiosInstance, expiryDate.toISOString());
          const stored = await getOtpSession(db, mobileNumber);
            if (stored) {
              console.log("✅ Offline ODP stored:", stored);
            } else {
              console.log("❌ Offline ODP not saved!");
            }
          
            })();

           Alert.alert(
            "Success",
            message,
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Dashboard' }],
                    })
                  );
                },
              },
            ]
          );

          } else if(statusCode === 203) {
            Alert.alert('Invalid Credentials!!', message);
          } else {
            Alert.alert('Error', message);
          }
          props.setOtpVerifySuccess();
          }
        }, [props.otpVerifySuccess]);
      
        useEffect(() => {
          if (props.otpVerifyError) {
            setLoading(false);
      
              Alert.alert("Login Failed", "Please check internet connection!");

            props.setOtpVerifyError();
          }
        }, [props.otpVerifyError]);
    
      const handleResendOtp = () => {
        setTimer(30);
        setIsResendEnabled(false);
        setOtp(['', '', '', '', '', '']);
        
        abortControllerRef.current = new AbortController();

      const fields = { userName: mobileNumber };

      props.userLogin(fields, abortControllerRef.current);
      };

        useEffect(() => {
          if (props.isLoginSuccess) {
            const statusCode = props.loginModel?.statusCode;
            const message = props.loginModel?.message;
      
            if(statusCode === 200) {
              Alert.alert('Login success', `${message} to ${mobileNumber}`);
      
              navigation.navigate('otpVerify', {
              mobileNumber: mobileNumber
            });
            } else if(statusCode === 203) {
              Alert.alert('Check Mobile Number', `${message}`);
            }
            props.setLoginSuccess();
          }
        }, [props.isLoginSuccess]);

      useEffect(() => {
          if (props.loginError) {
            setLoading(false);
       
              if (props.loginError?.message === "Network Error"){
                Alert.alert("Login Failed", "Please check internet connection!");
              } else {
                 Alert.alert("Login Failed", props.loginError?.message ? props.loginError?.message : "Something went wrong, please try again!");
              }

            props.setLoginError();
          }
      }, [props.loginError]);
    
      const formatMobileNumber = (number) => {
        if (!number) return 'your mobile number';
        return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
      };

  return (
    <OtpVerificationPresentational
        timer={timer}
        setTimer={setTimer}
        otp={otp}
        setOtp={setOtp}
        isResendEnabled={isResendEnabled}
        setIsResendEnabled={setIsResendEnabled}
        otpInputs={otpInputs}
        formatMobileNumber={formatMobileNumber}
        handleResendOtp={handleResendOtp}
        handleVerifyOtp={handleVerifyOtp}
        handleOtpChange={handleOtpChange}
        focusPrevious={focusPrevious}
        focusNext={focusNext}
        loading={loading}
        navigation={navigation}
    />
  )
}

function mapStateToProps(state) {
  return {
    otpVerifyModel: state.login.otpVerifyModel,
    otpVerifyIn: state.login.otpVerifyIn,
    otpVerifySuccess: state.login.otpVerifySuccess,
    otpVerifyError: state.login.otpVerifyError,

    loginModel: state.login.loginModel,
    isLogingIn: state.login.isLogingIn,
    isLoginSuccess: state.login.isLoginSuccess,
    loginError: state.login.loginError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    OtpVerify: (fields, controller) => dispatch(LoginActions.OtpVerify(fields, controller)),
    setOtpVerifySuccess: () => dispatch(LoginActions.setOtpVerifySuccess()),
    setOtpVerifyError: () => dispatch(LoginActions.setOtpVerifyError()),

    userLogin: (fields, controller) => dispatch(LoginActions.userLogin(fields, controller)),
    setLoginSuccess: () => dispatch(LoginActions.setLoginSuccess()),
    setLoginError: () => dispatch(LoginActions.setLoginError()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OtpVerificationContainer);