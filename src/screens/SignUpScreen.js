import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4001";

const signUp = async ({ email, password, name, phone }) => {
  const requestUrl = `${backendUrl}/api/auth/signup`;
  const requestBody = { email, password, name, phone };

  console.log("[SignUp] Request URL:", requestUrl);
  console.log("[SignUp] Request Body:", { ...requestBody, password: "***" });

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json().catch(() => ({}));
    console.log("[SignUp] Response Status:", response.status);
    console.log("[SignUp] Response Payload:", payload);

    if (!response.ok) {
      throw new Error(payload.message || `Sign up failed (${response.status})`);
    }

    return payload;
  } catch (err) {
    console.error("[SignUp] Network/API Error:", err);

    const message = err?.message || "Sign up failed";
    if (
      message.toLowerCase().includes("network request failed") &&
      backendUrl.includes("localhost")
    ) {
      throw new Error(
        "Network request failed: you are using localhost. On a real phone, set EXPO_PUBLIC_BACKEND_URL to your PC IP (example: http://192.168.x.x:4001)."
      );
    }

    throw err;
  }
};

export default function SignUpScreen({ onSuccess, onGoLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      console.log("[SignUp] Success -> navigating to Login");
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      console.error("[SignUp] Mutation Error:", err);
    },
  });

  const handleSignUp = () => {
    if (!name.trim() || !phone.trim()) {
      setFormError("Name and phone are required");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setFormError("");
    signUpMutation.mutate({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Create Account</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full name"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Phone number"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
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
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm password"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
      {formError ? <Text style={{ color: "crimson" }}>{formError}</Text> : null}
      {signUpMutation.isError ? (
        <Text style={{ color: "crimson" }}>{signUpMutation.error?.message || "Sign up failed"}</Text>
      ) : null}
      <TouchableOpacity
        onPress={handleSignUp}
        disabled={signUpMutation.isPending}
        style={{
          backgroundColor: "#111827",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          opacity: signUpMutation.isPending ? 0.7 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {signUpMutation.isPending ? "Creating account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoLogin}>
        <Text style={{ color: "#2563eb", fontWeight: "500" }}>
          Already registered? Go to login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
