import { useState } from "react";
import { Appearance, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export function SettingsScreen() {

  const [darkMode, changeDarkMode] = useState(false);

  toggleChangeDarkMode = () => {
    changeDarkMode(!darkMode)
    Appearance.setColorScheme(darkMode ? 'dark' : 'light');
  }

    return (
      <SafeAreaView style={styles.container}>
        <View style={{
          flexDirection: 'column'
        }}>
          
          <View style={{
            flexDirection: "row",
            alignItems: "stretch"
          }}>
            <Text>Switch to darkMode</Text>
            <Switch 
          value={!darkMode}
          onValueChange={() => {
            toggleChangeDarkMode()
          }}
          />
          </View>
          
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
});

