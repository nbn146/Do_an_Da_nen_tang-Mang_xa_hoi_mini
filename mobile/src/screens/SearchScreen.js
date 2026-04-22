import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { api } from "../api/client";
import { ui } from "../theme";

export default function SearchScreen() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState({ users: [], posts: [] });

  const submit = async () => {
    const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
    setResult(data);
  };

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.page}>
      <View style={ui.card}>
        <Text style={ui.sectionTitle}>Search</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search users or #hashtag"
          style={ui.input}
        />
        <Pressable style={ui.button} onPress={submit}>
          <Text style={ui.buttonText}>Search</Text>
        </Pressable>
      </View>

      <View style={ui.card}>
        <Text style={ui.sectionTitle}>Users</Text>
        {result.users.map((u) => (
          <View key={u._id} style={[ui.row, { marginBottom: 8 }]}>
            <View style={ui.avatarSm} />
            <Text>{u.name}</Text>
          </View>
        ))}
        {result.users.length === 0 ? (
          <Text style={ui.muted}>No users found.</Text>
        ) : null}
      </View>

      <View style={ui.card}>
        <Text style={ui.sectionTitle}>Posts</Text>
        {result.posts.map((p) => (
          <View
            key={p._id}
            style={{
              backgroundColor: "#f8fbff",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <Text>{p.content}</Text>
          </View>
        ))}
        {result.posts.length === 0 ? (
          <Text style={ui.muted}>No posts found.</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
