import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";
import { loadToken } from "../lib/api";
import { useColors, type Colors } from "../lib/theme";

type Organiser = {
  name: string;
  role: string;
  initials: string;
  accent: "blue" | "red";
  photo?: ImageSourcePropType;
};

const ORGANISERS: Organiser[] = [
  {
    name: "Anurag Pandit",
    role: "GDG OC Organiser",
    initials: "AP",
    accent: "blue",
    photo: require("../../assets/images/anurag.png"),
  },
  {
    name: "Adrisha Biswas",
    role: "Organiser",
    initials: "AB",
    accent: "red",
    photo: require("../../assets/images/adrisha.png"),
  },
];

function Avatar({ person, colors }: { person: Organiser; colors: Colors }) {
  if (person.photo) {
    return <Image source={person.photo} style={styles.avatar} />;
  }
  const accent = person.accent === "blue" ? colors.blue : colors.red;
  return (
    <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: accent }]}>
      <Text style={styles.avatarInitials}>{person.initials}</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const colors = useColors();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const saved = await loadToken();
      if (saved) {
        router.replace("/events");
      } else {
        setChecking(false);
      }
    }
    check();
  }, [router]);

  if (checking) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: colors.blue }]} />
            <View style={[styles.dot, { backgroundColor: colors.red }]} />
            <View style={[styles.dot, { backgroundColor: colors.yellow }]} />
            <View style={[styles.dot, { backgroundColor: colors.green }]} />
          </View>
          <ThemeToggle />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>GDG Events</Text>
        <Text style={[styles.brand, { color: colors.blue }]}>
          GDG on Campus · IIIT Kalyani
        </Text>
        <Text style={[styles.tagline, { color: colors.muted }]}>
          Workshops, talks and meetups from your developer community, all in one
          place.
        </Text>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>
            ABOUT GDG IIIT KALYANI
          </Text>
          <Text style={[styles.about, { color: colors.text }]}>
            The Google Developer Group on campus at IIIT Kalyani — a student
            community that runs workshops, talks and hackathons for developers.
          </Text>

          <Text style={[styles.sectionTitle, styles.sectionTitleSpacing, { color: colors.muted }]}>
            ORGANISERS
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {ORGANISERS.map((person, index) => (
              <View
                key={person.name}
                style={[
                  styles.person,
                  index > 0 && {
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <Avatar person={person} colors={colors} />
                <View style={styles.personInfo}>
                  <Text style={[styles.personName, { color: colors.text }]}>
                    {person.name}
                  </Text>
                  <Text style={[styles.personRole, { color: colors.muted }]}>
                    {person.role}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button title="Log in" onPress={() => router.push("/login")} />
        <View style={{ height: 12 }} />
        <Button
          title="Create account"
          variant="outline"
          onPress={() => router.push("/register")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 24 },
  scroll: { flexGrow: 1 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dots: { flexDirection: "row" },
  dot: { width: 18, height: 18, borderRadius: 9, marginRight: 8 },
  title: { fontSize: 40, fontWeight: "800" },
  brand: { fontSize: 16, fontWeight: "700", marginTop: 6 },
  tagline: { fontSize: 18, marginTop: 12, lineHeight: 26 },
  section: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  sectionTitleSpacing: { marginTop: 24 },
  about: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 14,
  },
  person: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  personInfo: { marginLeft: 14, flex: 1 },
  personName: { fontSize: 16, fontWeight: "700" },
  personRole: { fontSize: 13, marginTop: 2 },
  avatar: { width: 56, height: 56, borderRadius: 28, overflow: "hidden" },
  avatarFallback: { alignItems: "center", justifyContent: "center" },
  avatarInitials: { color: "white", fontSize: 20, fontWeight: "700" },
  actions: { paddingBottom: 16 },
});
