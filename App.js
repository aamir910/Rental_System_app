import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";

const queryClient = new QueryClient();

export default function App() {
  const [screen, setScreen] = useState("login");

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        {screen === "login" ? (
          <LoginScreen onSuccess={() => setScreen("home")} onGoSignUp={() => setScreen("signup")} />
        ) : null}
        {screen === "signup" ? (
          <SignUpScreen onSuccess={() => setScreen("login")} onGoLogin={() => setScreen("login")} />
        ) : null}
        {screen === "home" ? <HomeScreen /> : null}
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}
