import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HomeScreen } from './homeScreen';
import { ProfileScreen } from './profile';
import { CustomHomeHeader } from './Headers/header_home';

const Stack = createNativeStackNavigator();


export const RouteHandler = () => {
    return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name='home'
        component={HomeScreen}
        options={{
            headerRight: () => <CustomHomeHeader/>,
            headerTransparent: true
            }}/>
        <Stack.Screen
        name='profile'
        component={ProfileScreen}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
    );
}

