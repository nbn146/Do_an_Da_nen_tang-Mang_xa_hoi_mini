import { StyleSheet } from "react-native";

export const palette = {
  ink: "#0f172a",
  muted: "#5f6b7a",
  bg: "#f4fafc",
  card: "#ffffff",
  line: "#d7e2ee",
  primary: "#0b8f7b",
  primaryDark: "#0a7768",
  accent: "#f5a524",
};

export const ui = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  page: {
    padding: 14,
  },
  card: {
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: palette.muted,
    marginBottom: 12,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonGhost: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonGhostText: {
    color: palette.ink,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.ink,
    marginBottom: 10,
  },
  muted: {
    color: palette.muted,
  },
  avatarSm: {
    width: 42,
    height: 42,
    borderRadius: 999,
    marginRight: 10,
    backgroundColor: "#e8f2ff",
  },
  avatarLg: {
    width: 90,
    height: 90,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: "#e8f2ff",
  },
  tag: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#eef9f6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#0a6f62",
    marginVertical: 8,
    fontWeight: "600",
  },
});
