const loginState = {
  //initial values for login
  loginModel: [],
  isLogingIn: false,
  isLoginSuccess: false,
  loginError: '',

  //otp verify
  otpVerifyModel: [],
  otpVerifyIn: false,
  otpVerifySuccess: false,
  otpVerifyError: '',

}

// user login reducer included in store
export const login = function (state = loginState, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return Object.assign({}, state, { isLogingIn: true, isLoginSuccess: false })
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, { loginModel: action.payload, isLogingIn: false, isLoginSuccess: true })
    case 'LOGIN_FAILURE':
      return Object.assign({}, state, { loginError: action.payload, isLogingIn: false, isLoginSuccess: false })
    case 'SET_IS_LOGIN_SUCCESS':
      return Object.assign({}, state, { isLoginSuccess: false })
    case 'SET_LOGIN_ERROR':
      return Object.assign({}, state, { loginError: '' })

    case 'OTP_VERIFY_START':
      return Object.assign({}, state, { otpVerifyIn: true, otpVerifySuccess: false })
    case 'OTP_VERIFY_SUCCESS':
      return Object.assign({}, state, { otpVerifyModel: action.payload, otpVerifyIn: false, otpVerifySuccess: true })
    case 'OTP_VERIFY_FAILURE':
      return Object.assign({}, state, { otpVerifyError: action.payload, otpVerifyIn: false, otpVerifySuccess: false })
    case 'SET_IS_OTP_VERIFY_SUCCESS':
      return Object.assign({}, state, { otpVerifySuccess: false })
    case 'SET_IS_OTP_VERIFY_ERROR':
      return Object.assign({}, state, { otpVerifyError: '' })

    default:
      return state;
  }

}