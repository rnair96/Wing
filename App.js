import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';
import registerNNPushToken from 'native-notify';


export default function App() {
  registerNNPushToken(6654, 'A2FDEodxIsFgrMD1Mbvpll');

  return (
    <NavigationContainer>
      <AuthProvider>
        {/*passes down the cool auth stuff to children... */}
      <StackNavigator/>
      </AuthProvider>
    </NavigationContainer>
  );
}
