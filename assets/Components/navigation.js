import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HomeScreen } from './homeScreen';
import { ProfileScreen } from './profile';
import { CustomHomeHeader } from './Headers/header_home';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { View } from 'react-native';
import { GameScreen } from './gameScreen';

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
                  headerRight: () => <CustomHomeHeader/>,
                  headerTransparent: true,
                  headerTitle: ""
                  }}/>
              <Stack.Screen
              name='profile'
              component={ProfileScreen}
              />

              <Stack.Screen 
              name='game'
              component={GameScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </GestureHandlerRootView>
    );
}

