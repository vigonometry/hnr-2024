import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
const Home = ({navigation}) => (
  <View style={styles.container}>
    <Text>Hello World</Text>
    <Button mode="contained" onPress={() => navigation.navigate("Meme")}>
      Click Me!
    </Button>
    <StatusBar style="auto" />
  </View>
);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    }
});

export default Home;
