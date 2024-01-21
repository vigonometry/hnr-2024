import { Button, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from '@react-navigation/native';


export function ForceExitHeader() {
    
    const navigation =  useNavigation();

    return (
        <View>
            <Button  title="Home" onPress={() => navigation.navigate("home")}/>
        </View>
    )
}