export interface INotification {
  id?: string;
  title?: string;
  body?: string;
  read?: boolean;
}

export function useNotifications() {
  // Minimal stub for local development — replace with real implementation
  return {
    notifications: [] as INotification[],
    isLoading: false,
    error: null as null | string,
    unreadCount: 0,
    markAsRead: (_id?: string) => {},
    markAllAsRead: () => {},
  };
}

export default useNotifications;
