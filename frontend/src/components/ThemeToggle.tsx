import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme, type ThemeMode } from "../lib/theme";

const LABELS: Record<ThemeMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

export default function ThemeToggle() {
  const { mode, cycleMode, colors } = useTheme();

  return (
    <Pressable
      onPress={cycleMode}
      accessibilityRole="button"
      accessibilityLabel={`Theme: ${LABELS[mode]}. Tap to change.`}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.label, { color: colors.muted }]}>
        Theme: {LABELS[mode]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: { fontSize: 12, fontWeight: "600" },
});
