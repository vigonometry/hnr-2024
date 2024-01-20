import { Avatar } from "@rneui/base/dist/Avatar/Avatar";
import { Component } from "react";
import {
  Button,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileScreen() {

  updateProfile = true;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

      <Avatar
        size={200}
        rounded
        source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
      />
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 0.75,
          }}
        >
          <Text>Name:</Text>

          <TextInput
            defaultValue="Hello"
            style={{
              borderColor: "black",
              borderWidth: 1,
              flex: 1,
            }}
            onChangeText={() => {
              this.updateProfile = false;
            }}
          />
        </View>

      </View>
      <Button title="Update profile" disabled={updateProfile}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
