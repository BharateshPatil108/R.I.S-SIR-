import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import CircularLoadingDots from '../utils/CircularLoadingDots';

const OtpVerificationScreen = (props) => {

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.content}>
        <Text style={styles.title}>ODP Verification</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit ODP sent to your mobile number
        </Text>

        <View style={styles.otpContainer}>
          {props.otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              value={digit}
              onChangeText={(text) => props.handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent: { key } }) => props.focusPrevious(index, key)}
              keyboardType="number-pad"
              maxLength={1}
              ref={(ref) => (props.otpInputs.current[index] = ref)}
            />
          ))}
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            ODP expires in {props.timer} seconds
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.resendButton, props.isResendEnabled && styles.resendButtonEnabled]}
          onPress={props.handleResendOtp}
          disabled={!props.isResendEnabled}
        >
          <Text style={[styles.resendText, props.isResendEnabled && styles.resendTextEnabled]}>
            Resend ODP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyButton} onPress={props.handleVerifyOtp}>
          <Text style={styles.verifyButtonText}>Verify ODP</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
        >
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Election Commission</Text>
      </View>
    </ScrollView>

    {props.loading && (
        <View style={styles.loaderOverlay}>
          <CircularLoadingDots 
            size={12}
            color="#d86060ff"
            dotCount={6}
            animationType="rotate"
            circleSize={80}
          />
          <Text style={{ color: '#fff', marginTop: 12, fontWeight: '600' }}>
            Please wait...
          </Text>
        </View>
    )}

  </View>
  )
}

export default OtpVerificationScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  otpInputFilled: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  timerContainer: {
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  resendButton: {
    marginBottom: 25,
    opacity: 0.5,
  },
  resendButtonEnabled: {
    opacity: 1,
  },
  resendText: {
    color: '#6b7280',
    fontSize: 14,
  },
  resendTextEnabled: {
    color: '#2563eb',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#102657ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    shadowColor: '#5a7798ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 30,
  },
  backText: {
    color: '#6b7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});