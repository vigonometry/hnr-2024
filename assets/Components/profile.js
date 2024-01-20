import { Button, Image, StatusBar, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileScreen(){
    return (
        <SafeAreaView style={styles.container}>

            <StatusBar 
            hidden= {true}/>

            <Image
            width={200}
            height={200}
            source={{uri: "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg?w=400&h=300&c=crop"}}
            />
            <TextInput
              defaultValue="Hello"
              style={{
    
                borderColor: "black",
                borderWidth: 1,
              }}
            />
            <TextInput
              defaultValue="World"
              style={{
                borderColor: "black",
                borderWidth: 1,
              }}
            />


        </SafeAreaView>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: "space-evenly",
    },
});
  