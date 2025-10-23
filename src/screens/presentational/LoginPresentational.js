import LoginScreen from '../components/LoginScreen'

const LoginPresentational = (props) => {
  return (
    <LoginScreen
      name={props.name}
      setName={props.setName}
      mobileNumber={props.mobileNumber}
      setMobileNumber={props.setMobileNumber}
      rememberMe={props.rememberMe}
      setRememberMe={props.setRememberMe}
      countryCode={props.countryCode}
      nameError={props.nameError}
      mobError={props.mobError}
      setCountryCode={props.setCountryCode}
      handleSendOTP={props.handleSendOTP}
      loading={props.loading}
      toggleLanguage={props.toggleLanguage}
    />
  )
}

export default LoginPresentational