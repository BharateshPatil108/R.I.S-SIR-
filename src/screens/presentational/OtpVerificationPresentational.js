import { View, Text } from 'react-native'
import React from 'react'
import OtpVerificationScreen from '../components/OtpVerificationScreen';

const OtpVerificationPresentational = (props) => {
  return (
    <OtpVerificationScreen
      timer={props.timer}
      setTimer={props.setTimer}
      otp={props.otp}
      setOtp={props.setOtp}
      isResendEnabled={props.isResendEnabled}
      setIsResendEnabled={props.setIsResendEnabled}
      otpInputs={props.otpInputs}
      formatMobileNumber={props.formatMobileNumber}
      handleResendOtp={props.handleResendOtp}
      handleVerifyOtp={props.handleVerifyOtp}
      handleOtpChange={props.handleOtpChange}
      focusPrevious={props.focusPrevious}
      focusNext={props.focusNext}
      loading={props.loading}
      navigation={props.navigation}
    />
  )
}

export default OtpVerificationPresentational;