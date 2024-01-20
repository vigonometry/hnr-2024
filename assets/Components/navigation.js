import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HomeScreen } from './homeScreen';
import { ProfileScreen } from './profile';
import { CustomHomeHeader } from './Headers/header_home';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

export const RouteHandler = () => {
    return (
      <GestureHandlerRootView>
        <View style={{ height: "100%", width: "100%" }}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen 
              name='home'
              component={HomeScreen}
              options={{
                  headerTitle: () => <CustomHomeHeader/>
                  }}/>

              <Stack.Screen
              name='profile'
              component={ProfileScreen}
              />
              
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </GestureHandlerRootView>
    );
}

