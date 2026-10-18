import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useColors } from "../lib/theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline";
};

export default function Button({
  title,
  onPress,
  loading = false,
  variant = "primary",
}: Props) {
  const colors = useColors();
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.base,
        { borderColor: colors.blue },
        isPrimary ? { backgroundColor: colors.blue } : styles.outline,
        pressed && { opacity: 0.8 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "white" : colors.blue} />
      ) : (
        <Text style={[styles.text, { color: isPrimary ? "white" : colors.blue }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: { borderWidth: 2 },
  text: { fontSize: 16, fontWeight: "600" },
});
