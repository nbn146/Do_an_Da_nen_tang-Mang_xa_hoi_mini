import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { api } from "../api/client";
import { ui } from "../theme";

export default function PostComposer({ onCreated }) {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submit = async () => {
    if (!content.trim()) return;
    const formData = new FormData();
    formData.append("content", content);
    if (imageUri) {
      formData.append("image", {
        uri: imageUri,
        name: "post.jpg",
        type: "image/jpeg",
      });
    }
    await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setContent("");
    setImageUri("");
    onCreated();
  };

  return (
    <View style={ui.card}>
      <Text style={ui.sectionTitle}>Create a post</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Write something... #hashtag"
        multiline
        style={[ui.input, { minHeight: 90, textAlignVertical: "top" }]}
      />
      <Pressable style={ui.buttonGhost} onPress={pickImage}>
        <Text style={ui.buttonGhostText}>Pick image</Text>
      </Pressable>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 12,
            marginBottom: 8,
          }}
        />
      ) : null}
      <Pressable style={ui.button} onPress={submit}>
        <Text style={ui.buttonText}>Post now</Text>
      </Pressable>
    </View>
  );
}
