import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';


export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        {/*passes down the cool auth stuff to children... */}
      <StackNavigator/>
      </AuthProvider>
    </NavigationContainer>
  );
}
