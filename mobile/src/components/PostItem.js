import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { api } from "../api/client";
import { ui } from "../theme";

export default function PostItem({ post, onRefresh }) {
  const [text, setText] = useState("");

  const like = async () => {
    await api.post(`/posts/${post._id}/like`);
    onRefresh();
  };

  const comment = async () => {
    if (!text.trim()) return;
    await api.post(`/posts/${post._id}/comment`, { text });
    setText("");
    onRefresh();
  };

  return (
    <View style={ui.card}>
      <View style={ui.row}>
        <View style={ui.avatarSm} />
        <View>
          <Text style={{ fontWeight: "700", color: "#0f172a" }}>
            {post.author?.name}
          </Text>
          <Text style={ui.muted}>
            {new Date(post.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      <Text>{post.content}</Text>
      <Text style={ui.tag}>{post.likes?.length || 0} likes</Text>
      <Pressable style={ui.buttonGhost} onPress={like}>
        <Text style={ui.buttonGhostText}>Like / Unlike</Text>
      </Pressable>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Comment..."
        style={ui.input}
      />
      <Pressable style={ui.button} onPress={comment}>
        <Text style={ui.buttonText}>Send comment</Text>
      </Pressable>
      {(post.comments || []).map((c) => (
        <View
          key={c._id}
          style={{
            backgroundColor: "#f8fbff",
            borderRadius: 8,
            padding: 8,
            marginTop: 6,
          }}
        >
          <Text>
            <Text style={{ fontWeight: "700" }}>{c.user?.name}: </Text>
            {c.text}
          </Text>
        </View>
      ))}
    </View>
  );
}
