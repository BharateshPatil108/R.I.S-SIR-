import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const LoginScreen = (props) => {

  return (
    <SafeAreaView 
      style={styles.container}
    >

      {/* <View style={styles.languageButtonContainer}>
        <TouchableOpacity 
          onPress={() => props.toggleLanguage}
          style={styles.languageButton}
        >
          <Icon name="language" size={20} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.languageButtonText}>Kannada</Text>
        </TouchableOpacity>
      </View> */}

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.subtitle}>Please enter your details to securely log in.</Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* <View style={styles.inputGroup}> */}
            {/* <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={[styles.input, props.nameError && styles.inputError]}
              placeholder="Enter your Name"
              placeholderTextColor="#9ca3af"
              value={props.name}
              onChangeText={(text) => {
                const trimmedText = text.replace(/^\s+/, '');
                props.setName(trimmedText)
              }}
              autoCapitalize="words"
            />
            {props.nameError ? (
              <Text style={styles.errorText}>{props.nameError}</Text>
            ) : null}
          </View> */}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>UserName / Mobile Number</Text>
            <View style={styles.mobileInputContainer}>
              {/* <View style={[styles.countryCodeContainer, props.mobError && styles.inputErrorBorder]}>
                <Text style={styles.countryCodeText}>{props.countryCode}</Text>
              </View> */}
              <TextInput
                style={[styles.mobileInput, props.mobError && styles.inputError]}
                placeholder="Please Enter"
                placeholderTextColor="#9ca3af"
                value={props.mobileNumber}
                onChangeText={props.setMobileNumber}
                // keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
            {props.mobError ? (
              <Text style={styles.errorText}>{props.mobError}</Text>
            ) : null}
          </View>
          
          <TouchableOpacity 
            style={[styles.otpButton, (!props.mobileNumber || props.loading) && styles.otpButtonDisabled]} 
            onPress={props.handleSendOTP}
            disabled={!props.mobileNumber || props.loading}
          >
            {props.loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.otpButtonText}>Send ODP</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Election Commission</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  languageButtonContainer: {
    position: 'absolute',
    top: 100,
    right: 25,
    zIndex: 10,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4b5563',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    paddingLeft: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputErrorBorder: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeContainer: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  mobileInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    borderRadius:5,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  otpButton: {
    backgroundColor: '#102657ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginTop: 10,
  },
  otpButtonDisabled: {
    backgroundColor: '#5a7798ff',
    shadowColor: '#93c5fd',
  },
  otpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;