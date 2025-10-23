import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SplashScreen from '../screens/components/SplashScreen';
import LoginContainer from '../screens/container/LoginContainer';
import OtpVerificationContainer from '../screens/container/OtpVerificationContainer';
import HomeScreenContainer from '../screens/container/HomeScreenContainer';
import ElectrolDetailsEntryContainer from '../screens/container/ElectorDetailsEntryContainer';
import ViewAndEditEnumerationContainer from '../screens/container/ViewAndEditEnumerationContainer';
import FormDistributionContainer from '../screens/container/FormDistributionContainer';
import FormCollectionContainer from '../screens/container/FormCollectionContainer';
import BLOContactDetailsContainer from '../screens/container/BLOContactDetailsContainer';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={() => ({ 
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Login"
        component={LoginContainer}
        options={() => ({ 
          headerShown: false,
          title: "BLO Login",
          headerTitleAlign: 'center',
          headerBackVisible: false,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="otpVerify"
        component={OtpVerificationContainer}
        options={() => ({ 
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Dashboard"
        component={HomeScreenContainer}
      />
      <Stack.Screen
        name="BloDetailsEntry"
        component={ElectrolDetailsEntryContainer}
        options={{
          headerShown: true,
          title: "Elector Details",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ViewAndEditEnumeration"
        component={ViewAndEditEnumerationContainer}
        options={{
          headerShown: true,
          title: "View And Edit Enumeration",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="FormDistribution"
        component={FormDistributionContainer}
        options={{
          headerShown: true,
          title: "Enumeration Forms Distribution",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="FormCollection"
        component={FormCollectionContainer}
        options={{
          headerShown: true,
          title: "Forms Collection",
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ContactDetails"
        component={BLOContactDetailsContainer}
        options={{
          headerShown: true,
          title: "Contact Information",
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;