import { Button, StyleSheet, View } from "react-native"

function HomeScreen({navigation}){
    return (
    <View style={styles.container}>
        <Button title="Go profile" onPress={() => navigation.navigate("profile")}>
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
  