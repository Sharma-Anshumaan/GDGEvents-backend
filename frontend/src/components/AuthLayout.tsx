import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { useColors } from "../lib/theme";

type Props = { title: string; subtitle: string; children: ReactNode };

export default function AuthLayout({ title, subtitle, children }: Props) {
  const colors = useColors();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {subtitle}
        </Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 8 },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 16, marginTop: 6, marginBottom: 28 },
});
