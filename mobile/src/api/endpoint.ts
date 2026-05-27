export const ENDPOINTS = {
  // Notifications
  // Notifications
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  NOTIFICATION_READ_ALL: "/notifications/read-all",
  NOTIFICATION_UNREAD_COUNT: "/notifications/unread-count",
  NOTIFICATION_DELETE: (id: string) => `/notifications/${id}`,

  // Conversations
  CONVERSATIONS: "/conversations",
  CREATE_CONVERSATION: (receiverId: string) => `/conversations/${receiverId}`,
  MESSAGES: (conversationId: string) =>
    `/conversations/${conversationId}/messages`,
  MESSAGE_UPLOAD: (conversationId: string) =>
    `/conversations/${conversationId}/messages/upload`,
  MARK_READ: (conversationId: string) =>
    `/conversations/${conversationId}/read`,
  DELETE_MESSAGE: (conversationId: string, messageId: string) =>
    `/conversations/${conversationId}/messages/${messageId}`,
} as const;
