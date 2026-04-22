import { Heart, MessageCircle, UserPlus, AtSign, Share2, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "share";
  user: {
    name: string;
    avatar: string;
  };
  content?: string;
  postImage?: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Minh Anh",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    postImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    timestamp: "5 phút trước",
    read: false
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Tuấn Kiệt",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    content: "Bức ảnh này đẹp quá! Chụp ở đâu vậy bạn?",
    postImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    timestamp: "15 phút trước",
    read: false
  },
  {
    id: "3",
    type: "follow",
    user: {
      name: "Hương Giang",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    timestamp: "1 giờ trước",
    read: false
  },
  {
    id: "4",
    type: "mention",
    user: {
      name: "Đức Anh",
      avatar: "https://i.pravatar.cc/150?img=33"
    },
    content: "đã nhắc đến bạn trong một bình luận",
    timestamp: "2 giờ trước",
    read: true
  },
  {
    id: "5",
    type: "share",
    user: {
      name: "Thu Hà",
      avatar: "https://i.pravatar.cc/150?img=20"
    },
    content: "đã chia sẻ bài viết của bạn",
    postImage: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    timestamp: "3 giờ trước",
    read: true
  },
  {
    id: "6",
    type: "like",
    user: {
      name: "Hoàng Long",
      avatar: "https://i.pravatar.cc/150?img=15"
    },
    postImage: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    timestamp: "5 giờ trước",
    read: true
  },
  {
    id: "7",
    type: "comment",
    user: {
      name: "Mai Linh",
      avatar: "https://i.pravatar.cc/150?img=45"
    },
    content: "Cảm ơn bạn đã chia sẻ! Rất hữu ích 😊",
    timestamp: "1 ngày trước",
    read: true
  }
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
    case "comment":
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case "follow":
      return <UserPlus className="w-5 h-5 text-purple-500" />;
    case "mention":
      return <AtSign className="w-5 h-5 text-green-500" />;
    case "share":
      return <Share2 className="w-5 h-5 text-orange-500" />;
  }
};

const getNotificationText = (notification: Notification) => {
  switch (notification.type) {
    case "like":
      return "đã thích bài viết của bạn";
    case "comment":
      return "đã bình luận bài viết của bạn";
    case "follow":
      return "đã bắt đầu theo dõi bạn";
    case "mention":
      return notification.content || "đã nhắc đến bạn";
    case "share":
      return notification.content || "đã chia sẻ bài viết của bạn";
  }
};

export function NotificationsView() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Thông báo
          </h2>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-100">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? "bg-purple-50/50" : ""
              }`}
            >
              <div className="flex gap-3">
                {/* Avatar with notification icon */}
                <div className="relative flex-shrink-0">
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900">
                          {notification.user.name}
                        </span>{" "}
                        <span className="text-gray-600">
                          {getNotificationText(notification)}
                        </span>
                      </p>
                      {notification.type === "comment" && notification.content && (
                        <p className="mt-1 text-sm text-gray-700 bg-gray-100 rounded-lg p-2">
                          "{notification.content}"
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>

                    {/* Post thumbnail */}
                    {notification.postImage && (
                      <img
                        src={notification.postImage}
                        alt="Post"
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="p-4 text-center">
          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
            Xem thêm thông báo
          </button>
        </div>
      </div>
    </div>
  );
}
