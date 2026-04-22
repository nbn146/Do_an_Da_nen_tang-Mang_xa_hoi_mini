import { useState } from "react";
import { PostCard } from "./PostCard";

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Minh Anh",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      username: "@minhanh"
    },
    content: "Buổi sáng tuyệt vời tại Hà Nội! Cà phê và bình minh là tất cả những gì tôi cần. ☕️🌅",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    timestamp: "2 giờ trước",
    likes: 124,
    comments: 18,
    shares: 5
  },
  {
    id: "2",
    author: {
      name: "Tuấn Kiệt",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      username: "@tuankiet"
    },
    content: "Coding session hôm nay thật productive! Vừa hoàn thành feature mới cho dự án. 💻✨ #developer #coding",
    timestamp: "4 giờ trước",
    likes: 89,
    comments: 12,
    shares: 3
  },
  {
    id: "3",
    author: {
      name: "Lan Hương",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      username: "@lanhuong"
    },
    content: "Cuối tuần này đi hiking ở núi Tam Đảo. Không khí trong lành và phong cảnh tuyệt đẹp! 🏔️🌲",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
    timestamp: "6 giờ trước",
    likes: 256,
    comments: 34,
    shares: 12
  },
  {
    id: "4",
    author: {
      name: "Đức Mạnh",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      username: "@ducmanh"
    },
    content: "Món ăn mới thử hôm nay - Ramen Nhật Bản cực kỳ ngon! Nước dashi đậm đà, mì dai ngon. Highly recommended! 🍜❤️",
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&h=600&fit=crop",
    timestamp: "1 ngày trước",
    likes: 178,
    comments: 23,
    shares: 8
  },
  {
    id: "5",
    author: {
      name: "Thu Trang",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      username: "@thutrang"
    },
    content: "Sunset tại bãi biển Đà Nẵng. Những khoảnh khắc yên bình như thế này thật đáng quý. 🌅🌊",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    timestamp: "1 ngày trước",
    likes: 312,
    comments: 45,
    shares: 19
  }
];

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Create Post */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-gray-200/50">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
            alt="Your avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <input
            type="text"
            placeholder="Bạn đang nghĩ gì?"
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-all">
            <span className="text-xl">📸</span>
            <span className="text-sm text-gray-600 hidden sm:inline">Ảnh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-all">
            <span className="text-xl">🎥</span>
            <span className="text-sm text-gray-600 hidden sm:inline">Video</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-all">
            <span className="text-xl">😊</span>
            <span className="text-sm text-gray-600 hidden sm:inline">Cảm xúc</span>
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      ))}
    </div>
  );
}
