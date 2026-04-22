import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { ui } from "../theme";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async () => {
    setErrorMessage("");
    const result = await login(email, password);
    if (!result.ok) {
      setErrorMessage(result.message);
    }
  };

  return (
    <View style={[ui.screen, ui.page]}>
      <View style={ui.card}>
        <Text style={ui.title}>Login</Text>
        <Text style={ui.subtitle}>
          Join the conversation and stay in sync in real time.
        </Text>
      </View>

      <View style={ui.card}>
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
          <Text style={ui.buttonText}>Login</Text>
        </Pressable>
        <Pressable
          style={ui.buttonGhost}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={ui.buttonGhostText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}
