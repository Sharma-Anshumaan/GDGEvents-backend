import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import Button from "../components/Button";
import { api, saveToken } from "../lib/api";
import { useColors } from "../lib/theme";

export default function Register() {
  const router = useRouter();
  const colors = useColors();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!username.trim()) {
      setError("Choose a username");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await api("/register/", "POST", {
        username: username.trim(),
        password: password,
      });
      if (result.ok) {
        await saveToken(result.data.token);
        router.replace("/events");
      } else {
        setError(result.data?.error || "Registration failed");
      }
    } catch {
      setError("Cannot reach the server. Check your internet.");
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <AuthLayout title="Create account" subtitle="Join to follow community events">
        <Field
          label="Username"
          placeholder="pick a username"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
        />
        <Field
          label="Password"
          placeholder="at least 6 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Field
          label="Confirm password"
          placeholder="type it again"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        {error !== "" && (
          <Text style={[styles.error, { color: colors.red }]}>{error}</Text>
        )}

        <Button title="Create account" onPress={submit} loading={loading} />
      </AuthLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: { marginBottom: 12, fontSize: 14 },
});
