export function connectSocket() {
  // Minimal no-op socket connector for local dev.
  // Replace with real socket.io client logic when available.
  if (typeof window === "undefined") return null;
  try {
    // no-op placeholder
    return null;
  } catch (e) {
    return null;
  }
}

export default connectSocket;
