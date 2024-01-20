import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HomeScreen } from './homeScreen';
import { ProfileScreen } from './profile';

const Stack = createNativeStackNavigator();

export const RouteHandler = () => {
    return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name='home'
        component={HomeScreen}
        options={{title: "Welcome"}}/>
        <Stack.Screen
        name='profile'
        component={ProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    );
}

