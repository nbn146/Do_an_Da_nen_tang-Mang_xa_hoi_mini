import { useState } from "react";
import { Grid, Image as ImageIcon, MapPin, Link as LinkIcon, Calendar, MoreHorizontal, UserPlus, MessageCircle } from "lucide-react";
import { PostCard } from "./PostCard";
import type { Post } from "./PostFeed";

const DUMMY_POSTS: Post[] = [
  {
    id: "p1",
    author: {
      id: "u1",
      name: "Nguyễn Lê",
      username: "@nguyenle",
      avatar: "https://images.unsplash.com/photo-1588521225652-86fa6f11d20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGZlbWFsZSUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzY4NTIzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content: "Một ngày tuyệt vời để bắt đầu những dự án mới! 🌟 Cảm ơn mọi người đã luôn ủng hộ mình trong suốt thời gian qua.",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=600&fit=crop",
    likes: 1240,
    comments: 86,
    shares: 12,
    timestamp: "2 giờ trước",
  },
  {
    id: "p2",
    author: {
      id: "u1",
      name: "Nguyễn Lê",
      username: "@nguyenle",
      avatar: "https://images.unsplash.com/photo-1588521225652-86fa6f11d20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGZlbWFsZSUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzY4NTIzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content: "Đang tìm hiểu về React Router Data mode. Có ai có kinh nghiệm chia sẻ không ạ? 🤔",
    likes: 45,
    comments: 12,
    shares: 2,
    timestamp: "1 ngày trước",
  }
];

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<"posts" | "photos" | "about">("posts");

  return (
    <div className="flex flex-col space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 sm:h-64 relative w-full">
          <img 
            src="https://images.unsplash.com/photo-1655866000829-56884e6dca05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBtb3VudGFpbiUyMGdyYWRpZW50fGVufDF8fHx8MTc3Njg1MjMzMnww&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Profile Info Section */}
        <div className="relative px-4 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1588521225652-86fa6f11d20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGZlbWFsZSUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzY4NTIzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Avatar" 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-white shadow-xl"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              <div className="text-center sm:text-left mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nguyễn Lê</h1>
                <p className="text-gray-500 font-medium">@nguyenle</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-6 sm:mt-0 justify-center">
              <button className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                <UserPlus className="w-5 h-5" />
                <span>Theo dõi</span>
              </button>
              <button className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="mt-4 sm:mt-0 max-w-2xl">
            <p className="text-gray-700 mb-4 text-center sm:text-left text-lg">
              UI/UX Designer & Frontend Developer. Đam mê tạo ra những trải nghiệm mượt mà và đẹp mắt. 🎨✨
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
              <div className="flex items-center space-x-1">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-purple-600 hover:underline">portfolio.nguyenle.com</a>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Tham gia Tháng 4, 2023</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center sm:justify-start space-x-8 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center sm:text-left">
              <span className="block text-xl font-bold text-gray-900">12.5K</span>
              <span className="text-sm text-gray-500">Người theo dõi</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block text-xl font-bold text-gray-900">1,240</span>
              <span className="text-sm text-gray-500">Đang theo dõi</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block text-xl font-bold text-gray-900">45</span>
              <span className="text-sm text-gray-500">Bài viết</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all font-medium ${
              activeTab === "posts" 
                ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Grid className="w-5 h-5" />
            <span>Bài viết</span>
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all font-medium ${
              activeTab === "photos" 
                ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Hình ảnh</span>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all font-medium ${
              activeTab === "about" 
                ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Giới thiệu</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "posts" && (
          <div className="space-y-6">
            {DUMMY_POSTS.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => {}}
                onComment={() => {}}
                onShare={() => {}}
              />
            ))}
          </div>
        )}

        {activeTab === "photos" && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 p-6 text-center text-gray-500 py-20">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Chưa có hình ảnh nào</p>
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div className="flex pb-4 border-b border-gray-100">
                <span className="w-1/3 text-gray-500 font-medium">Làm việc tại</span>
                <span className="w-2/3 text-gray-900">Figma, Inc.</span>
              </div>
              <div className="flex pb-4 border-b border-gray-100">
                <span className="w-1/3 text-gray-500 font-medium">Từng học tại</span>
                <span className="w-2/3 text-gray-900">Đại học FPT</span>
              </div>
              <div className="flex pb-4 border-b border-gray-100">
                <span className="w-1/3 text-gray-500 font-medium">Sống tại</span>
                <span className="w-2/3 text-gray-900">Hà Nội</span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-gray-500 font-medium">Mối quan hệ</span>
                <span className="w-2/3 text-gray-900">Độc thân</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
