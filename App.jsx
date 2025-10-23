import { StatusBar, StyleSheet, View, Text, SafeAreaView} from 'react-native';
import React, { useEffect, useState } from 'react';
import AppNavigator from './src/Navigation/AppNavigator';
import NetInfo from '@react-native-community/netinfo';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { UserProvider, useUser } from './src/screens/utils/UserProvider';

function AppContent() {
  const [isConnected, setIsConnected] = useState(null);
  const [wasOffline, setWasOffline] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { setIsNetPresent } = useUser();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsNetPresent(state.isConnected);
      if (!state.isConnected) {
        setWasOffline(true);
      } else if (wasOffline) {
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 4000);
        setWasOffline(false);
      }
    });
    return unsubscribe;
  }, [wasOffline]);

  return (
    <SafeAreaView style={[styles.container, !isConnected && { paddingBottom: 20 }]}>
      <StatusBar barStyle="default"/>

      {!isConnected && (
        <View style={[styles.offlineBanner, { backgroundColor: 'red' }]}>
          <Text style={styles.offlineText}>You are Offline..</Text>
        </View>
      )}

      {showSnackbar && (
        <View style={[styles.offlineBanner, { backgroundColor: 'green' }]}>
          <Text style={styles.offlineText}>You are online now..</Text>
        </View>
      )}

      <AppNavigator />
    </SafeAreaView>
  );
}

function App() {
  return (
    <Provider store={store}>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold'
  },
  offlineBanner: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1000,
  },
  offlineText: {
    color: 'white',
    fontWeight: 'light',
  },
});

export default App;
