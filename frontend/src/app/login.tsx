import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import Button from "../components/Button";
import { api, saveToken } from "../lib/api";
import { useColors } from "../lib/theme";

export default function Login() {
  const router = useRouter();
  const colors = useColors();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!username.trim() || !password) {
      setError("Enter your username and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await api("/login/", "POST", {
        username: username.trim(),
        password: password,
      });
      if (result.ok) {
        await saveToken(result.data.token);
        router.replace("/events");
      } else {
        setError(result.data?.error || "Login failed");
      }
    } catch {
      setError("Cannot reach the server. Check your internet.");
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <AuthLayout title="Welcome back" subtitle="Log in to see upcoming events">
        <Field
          label="Username"
          placeholder="your username"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
        />
        <Field
          label="Password"
          placeholder="your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error !== "" && (
          <Text style={[styles.error, { color: colors.red }]}>{error}</Text>
        )}

        <Button title="Log in" onPress={submit} loading={loading} />
      </AuthLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: { marginBottom: 12, fontSize: 14 },
});
