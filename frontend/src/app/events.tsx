import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";
import { api, clearToken } from "../lib/api";
import { useColors } from "../lib/theme";

type EventItem = {
  id: number;
  title: string;
  description: string;
  venue: string;
  date: string;
};

function EventCard({
  item,
  now,
  expanded,
  onPress,
}: {
  item: EventItem;
  now: number;
  expanded: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const d = new Date(item.date);
  const isPast = d.getTime() < now;
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        isPast && { opacity: 0.6 },
      ]}
    >
      <View
        style={[
          styles.badge,
          { backgroundColor: isPast ? colors.border : colors.blue },
        ]}
      >
        <Text style={[styles.badgeMonth, isPast && { color: colors.muted }]}>
          {month}
        </Text>
        <Text style={[styles.badgeDay, isPast && { color: colors.muted }]}>
          {d.getDate()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          📍 {item.venue}
        </Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          🕒 {time}
          {isPast ? "  ·  Past event" : ""}
        </Text>
        {item.description !== "" && (
          <Text
            style={[styles.desc, { color: colors.text }]}
            numberOfLines={expanded ? undefined : 2}
          >
            {item.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default function Events() {
  const colors = useColors();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  async function logout() {
    await clearToken();
    router.replace("/");
  }

  async function load() {
    try {
      const result = await api("/events/");
      if (result.status === 401) {
        await logout();
        return;
      }
      const ts = Date.now();
      setNow(ts);
      setError("");
      if (result.ok) {
        const upcoming = result.data.filter(
          (e: EventItem) => new Date(e.date).getTime() >= ts
        );
        const past = result.data.filter(
          (e: EventItem) => new Date(e.date).getTime() < ts
        );
        setEvents([...upcoming, ...past]);
      } else {
        setError("Could not load events.");
      }
    } catch {
      setError("Cannot reach the server. Check your internet.");
    }
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    // Initial fetch — setState inside load() only ever runs after `await`.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  const upcomingCount = events.filter(
    (e) => new Date(e.date).getTime() >= now
  ).length;

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (error !== "" && events.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
        <View style={{ width: 160 }}>
          <Button title="Try again" onPress={onRefresh} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerRight}>
              <ThemeToggle />
              <Pressable onPress={logout}>
                <Text style={[styles.logout, { color: colors.red }]}>
                  Log out
                </Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <Text style={[styles.heading, { color: colors.muted }]}>
            {upcomingCount} upcoming {upcomingCount === 1 ? "event" : "events"}
          </Text>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.muted }]}>
            No events yet. Check back soon, or add some in the admin panel.
          </Text>
        }
        renderItem={({ item }) => (
          <EventCard
            item={item}
            now={now}
            expanded={expandedId === item.id}
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  heading: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  badge: {
    width: 56,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  badgeMonth: { color: "white", fontSize: 12, fontWeight: "700" },
  badgeDay: { color: "white", fontSize: 24, fontWeight: "800" },
  info: { flex: 1 },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  meta: { fontSize: 14, marginBottom: 2 },
  desc: { fontSize: 14, marginTop: 8, lineHeight: 20 },
  empty: { textAlign: "center", marginTop: 40 },
  errorText: { fontSize: 16, marginBottom: 16, textAlign: "center" },
  logout: { fontSize: 16, fontWeight: "600" },
});
