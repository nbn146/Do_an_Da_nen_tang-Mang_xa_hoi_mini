import { useState } from "react";
import { Search, Send, MoreVertical, Phone, Video, Image, Smile, Paperclip } from "lucide-react";

interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    user: {
      name: "Minh Anh",
      avatar: "https://i.pravatar.cc/150?img=5",
      isOnline: true
    },
    lastMessage: "Okee, hẹn gặp bạn nhé! 😊",
    timestamp: "2 phút",
    unreadCount: 2
  },
  {
    id: "2",
    user: {
      name: "Tuấn Kiệt",
      avatar: "https://i.pravatar.cc/150?img=12",
      isOnline: true
    },
    lastMessage: "Bạn có rảnh tối nay không?",
    timestamp: "15 phút",
    unreadCount: 0
  },
  {
    id: "3",
    user: {
      name: "Hương Giang",
      avatar: "https://i.pravatar.cc/150?img=9",
      isOnline: false
    },
    lastMessage: "Cảm ơn bạn nhiều nha!",
    timestamp: "1 giờ",
    unreadCount: 0
  },
  {
    id: "4",
    user: {
      name: "Đức Anh",
      avatar: "https://i.pravatar.cc/150?img=33",
      isOnline: false
    },
    lastMessage: "Mình đã gửi file cho bạn rồi đó",
    timestamp: "3 giờ",
    unreadCount: 1
  },
  {
    id: "5",
    user: {
      name: "Thu Hà",
      avatar: "https://i.pravatar.cc/150?img=20",
      isOnline: true
    },
    lastMessage: "Chúc bạn một ngày tốt lành! ✨",
    timestamp: "1 ngày",
    unreadCount: 0
  }
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "other",
    text: "Chào bạn! Bạn có rảnh cuối tuần này không?",
    timestamp: "10:30",
    isOwn: false
  },
  {
    id: "2",
    senderId: "me",
    text: "Chào! Mình rảnh mà, có chuyện gì vậy?",
    timestamp: "10:32",
    isOwn: true
  },
  {
    id: "3",
    senderId: "other",
    text: "Mình định đi chơi, bạn có muốn đi cùng không? 😊",
    timestamp: "10:33",
    isOwn: false
  },
  {
    id: "4",
    senderId: "me",
    text: "Oke luôn! Đi đâu thế?",
    timestamp: "10:34",
    isOwn: true
  },
  {
    id: "5",
    senderId: "other",
    text: "Mình nghĩ là đi cafe rồi xem phim, bạn thấy sao?",
    timestamp: "10:35",
    isOwn: false
  },
  {
    id: "6",
    senderId: "me",
    text: "Tuyệt vời! Thời gian nào nhỉ?",
    timestamp: "10:36",
    isOwn: true
  },
  {
    id: "7",
    senderId: "other",
    text: "Chủ nhật 2 giờ chiều nhé. Mình hẹn bạn ở trung tâm 🎬",
    timestamp: "10:38",
    isOwn: false
  },
  {
    id: "8",
    senderId: "other",
    text: "Okee, hẹn gặp bạn nhé! 😊",
    timestamp: "Vừa xong",
    isOwn: false
  }
];

export function MessagesView() {
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedUser = mockConversations.find(c => c.id === selectedConversation)?.user;

  const filteredConversations = mockConversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send message
      setMessageText("");
    }
  };

  return (
    <div className="h-full max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden h-full flex">
        {/* Conversations List */}
        <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Tin nhắn
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedConversation === conversation.id ? "bg-purple-50" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.user.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedUser.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isOwn
                          ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isOwn ? "text-purple-100" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Nhập tin nhắn..."
                      className="w-full px-4 py-2 pr-10 bg-gray-100 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm max-h-32"
                      rows={1}
                    />
                    <button className="absolute right-3 bottom-2 hover:scale-110 transition-transform">
                      <Smile className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-lg font-medium">Chọn một cuộc trò chuyện</p>
                <p className="text-sm mt-1">Để bắt đầu nhắn tin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
