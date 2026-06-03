export interface IConversation {
  id?: string;
  participants?: string[];
  unreadCount?: number;
}

export function useConversations() {
  // Minimal stub for local development — replace with real implementation
  return {
    conversations: [] as IConversation[],
    isLoading: false,
    error: null as null | string,
  };
}

export default useConversations;

// Also provide a lightweight `useMessages` export to match existing imports
export function useMessages(conversationId?: string) {
  return {
    messages: [] as any[],
    isLoading: false,
    isTyping: false,
    sendMessage: async (_text: string) => {},
    sendAttachment: async (_file: File, _type: string) => {},
    sendTyping: (_id?: string) => {},
    markAsRead: async () => {},
  };
}
