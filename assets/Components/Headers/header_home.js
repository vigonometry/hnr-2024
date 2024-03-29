import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Avatar } from "@rneui/base/dist/Avatar/Avatar";


export function CustomHomeHeader() {
    
    const navigation =  useNavigation();

    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate("profile")}>
            <Avatar
                size={32}
                rounded
                source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
            />
            </TouchableOpacity>
        </View>
    )
}