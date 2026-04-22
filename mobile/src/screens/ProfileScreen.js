import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ui } from "../theme";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/users/${user.id || user._id}/profile`)
      .then((res) => setProfile(res.data));
  }, [user]);

  if (!profile) return <Text style={{ padding: 16 }}>Loading profile...</Text>;

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.page}>
      <View style={[ui.card, ui.row]}>
        <View style={ui.avatarLg} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a" }}>
            {profile.user.name}
          </Text>
          <Text style={ui.muted}>{profile.user.email}</Text>
          <Text>{profile.user.bio || "No bio yet"}</Text>
        </View>
      </View>

      <View style={{ marginTop: 4 }}>
        <Text style={ui.sectionTitle}>My posts</Text>
        {profile.posts.map((p) => (
          <View key={p._id} style={ui.card}>
            <Text>{p.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
