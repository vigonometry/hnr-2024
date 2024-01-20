import { Button, StyleSheet, View } from "react-native"

function ProfileScreen({navigation}){
    return (
        <View style={styles.container}>
            <Button title="Go Home" onPress={() => navigation.navigate("home")}>
            </Button>
        </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'dodgeblue',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
  