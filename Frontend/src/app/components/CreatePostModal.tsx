import { useState } from "react";
import { X, Image as ImageIcon, Smile, MapPin, Users, Globe } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [postText, setPostText] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">("public");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleImageSelect = () => {
    // Mock image selection
    const mockImages = [
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
      "https://images.unsplash.com/photo-1682687220063-4742bd7fd538"
    ];
    setSelectedImages([...selectedImages, mockImages[selectedImages.length % 2]]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (postText.trim() || selectedImages.length > 0) {
      // Handle post creation
      onClose();
      setPostText("");
      setSelectedImages([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Tạo bài viết
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Nguyễn Văn A</h3>
            <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors mt-1">
              {privacy === "public" && (
                <>
                  <Globe className="w-3 h-3" />
                  <span>Công khai</span>
                </>
              )}
              {privacy === "friends" && (
                <>
                  <Users className="w-3 h-3" />
                  <span>Bạn bè</span>
                </>
              )}
              {privacy === "private" && (
                <>
                  <Users className="w-3 h-3" />
                  <span>Chỉ mình tôi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 max-h-96 overflow-y-auto">
          {/* Text Input */}
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full px-4 py-3 text-lg resize-none focus:outline-none min-h-32"
            autoFocus
          />

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add to Post */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Thêm vào bài viết</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleImageSelect}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                title="Thêm ảnh/video"
              >
                <ImageIcon className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                title="Thêm cảm xúc"
              >
                <Smile className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                title="Thêm vị trí"
              >
                <MapPin className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handlePost}
            disabled={!postText.trim() && selectedImages.length === 0}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Đăng bài
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
