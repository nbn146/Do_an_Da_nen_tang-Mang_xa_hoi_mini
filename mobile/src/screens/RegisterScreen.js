import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { ui } from "../theme";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async () => {
    setErrorMessage("");
    const result = await register(name, email, password);
    if (!result.ok) {
      setErrorMessage(result.message);
    }
  };

  return (
    <View style={[ui.screen, ui.page]}>
      <View style={ui.card}>
        <Text style={ui.title}>Register</Text>
        <Text style={ui.subtitle}>
          Create your profile to post, comment, and get notifications.
        </Text>
      </View>

      <View style={ui.card}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          style={ui.input}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={ui.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={ui.input}
        />
        {errorMessage ? (
          <Text style={{ color: "#b42318" }}>{errorMessage}</Text>
        ) : null}

        <Pressable style={ui.button} onPress={submit}>
          <Text style={ui.buttonText}>Register</Text>
        </Pressable>
        <Pressable
          style={ui.buttonGhost}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={ui.buttonGhostText}>Back to login</Text>
        </Pressable>
      </View>
    </View>
  );
}
