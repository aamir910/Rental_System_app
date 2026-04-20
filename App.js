import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rental App</Text>
      <HomeScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 36,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
});
