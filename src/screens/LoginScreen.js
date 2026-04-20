import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4001";

const signIn = async ({ email, password }) => {
  console.log(backendUrl);
  const response = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `Login failed (${response.status})`);
  }

  return payload;
};

export default function LoginScreen({ onSuccess, onGoSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
      {loginMutation.isError ? (
        <Text style={{ color: "crimson" }}>{loginMutation.error?.message || "Login failed"}</Text>
      ) : null}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loginMutation.isPending}
        style={{
          backgroundColor: "#111827",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          opacity: loginMutation.isPending ? 0.7 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loginMutation.isPending ? "Signing in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoSignUp}>
        <Text style={{ color: "#2563eb", fontWeight: "500" }}>
          Don&apos;t have an account? Create one here
        </Text>
      </TouchableOpacity>
    </View>
  );
}
