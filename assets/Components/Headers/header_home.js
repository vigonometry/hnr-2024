import { Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from '@react-navigation/native';

export function CustomHomeHeader() {
    
    const navigation =  useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate("profile")}>
            <Image 
            style= {{width: 50, height: 50}}
            source={{uri: "assets/account.png"}}
            />
        </TouchableOpacity>
    )
}