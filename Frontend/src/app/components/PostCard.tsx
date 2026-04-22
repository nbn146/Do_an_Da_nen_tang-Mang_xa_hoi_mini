import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import type { Post } from "./PostFeed";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id);
      setCommentText("");
      setShowComments(true);
    }
  };

  const handleShare = () => {
    onShare(post.id);
    alert("Đã chia sẻ bài viết!");
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{post.author.username}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="relative">
          <img
            src={post.image}
            alt="Post content"
            className="w-full object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">❤️</div>
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">👍</div>
          </div>
          <span>{post.likes} lượt thích</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{post.comments} bình luận</span>
          <span>{post.shares} chia sẻ</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-200/50 flex items-center justify-around">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-100 ${
            isLiked ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">Thích</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-600"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Bình luận</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-600"
        >
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </button>
        
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-lg transition-all hover:bg-gray-100 ${
            isSaved ? "text-purple-500" : "text-gray-600"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-200/50 pt-4">
          {/* Sample Comments */}
          <div className="space-y-3 mb-3">
            <div className="flex space-x-3">
              <img
                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop"
                alt="Commenter"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                <p className="font-semibold text-sm">Hoàng Nam</p>
                <p className="text-sm text-gray-700">Tuyệt vời quá! 🔥</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop"
                alt="Commenter"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                <p className="font-semibold text-sm">Mai Linh</p>
                <p className="text-sm text-gray-700">Đẹp quá đi! Mình cũng muốn đi thử! ❤️</p>
              </div>
            </div>
          </div>

          {/* Add Comment */}
          <div className="flex space-x-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
              />
              <button
                onClick={handleComment}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
