import { SafeAreaView } from "react-native-safe-area-context";


export function GameScreen(){
    return (
        <SafeAreaView>
            <Text>Test</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
