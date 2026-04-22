import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { io } from "socket.io-client";
import { api } from "../api/client";
import PostComposer from "../components/PostComposer";
import PostItem from "../components/PostItem";
import { useAuth } from "../context/AuthContext";
import { ui } from "../theme";

const socketUrl = "http://10.0.2.2:5000";

export default function FeedScreen({ navigation }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const [postsRes, notificationsRes] = await Promise.all([
      api.get("/posts/newsfeed"),
      api.get("/notifications"),
    ]);
    setPosts(postsRes.data);
    setNotifications(notificationsRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!user) return;
    const socket = io(socketUrl);
    socket.emit("register-user", user.id || user._id);
    socket.on("notification:new", (payload) => {
      setNotifications((prev) => [payload, ...prev]);
    });
    return () => socket.disconnect();
  }, [user]);

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.page}>
      <View style={[ui.card, ui.row, { justifyContent: "space-between" }]}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>
          Newsfeed
        </Text>
        <View style={[ui.row, { gap: 8 }]}>
          <Pressable
            style={ui.buttonGhost}
            onPress={() => navigation.navigate("Search")}
          >
            <Text style={ui.buttonGhostText}>Search</Text>
          </Pressable>
          <Pressable
            style={ui.buttonGhost}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={ui.buttonGhostText}>Profile</Text>
          </Pressable>
        </View>
      </View>

      <PostComposer onCreated={load} />
      {posts.map((post) => (
        <PostItem key={post._id} post={post} onRefresh={load} />
      ))}
      <View style={ui.card}>
        <Text style={ui.sectionTitle}>Notifications</Text>
        {notifications.slice(0, 10).map((n) => (
          <View
            key={n._id}
            style={{
              borderWidth: 1,
              borderColor: "#e4ebf4",
              borderRadius: 8,
              backgroundColor: "#f7fafc",
              padding: 8,
              marginBottom: 8,
            }}
          >
            <Text>{n.message}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
