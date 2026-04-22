import { MapPin, Calendar, Link as LinkIcon } from "lucide-react";

export function ProfileCard() {
  return (
    <div className="sticky top-20">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        {/* Cover Image */}
        <div className="h-24 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex flex-col items-center -mt-12">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
            <h2 className="mt-3 font-bold text-gray-900">Nguyễn Văn A</h2>
            <p className="text-sm text-gray-500">@nguyenvana</p>
          </div>
          
          {/* Bio */}
          <p className="text-sm text-gray-700 text-center mt-3 px-2">
            🚀 Developer | 📸 Photography | ✈️ Travel Lover
          </p>
          
          {/* Info */}
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Hà Nội, Việt Nam</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Tham gia tháng 3, 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4" />
              <a href="#" className="text-blue-600 hover:underline">portfolio.com</a>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-bold text-gray-900">1,234</p>
              <p className="text-xs text-gray-500">Bài viết</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">5.6K</p>
              <p className="text-xs text-gray-500">Người theo dõi</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">890</p>
              <p className="text-xs text-gray-500">Đang theo dõi</p>
            </div>
          </div>
          
          {/* Action Button */}
          <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Chỉnh sửa trang cá nhân
          </button>
        </div>
      </div>
    </div>
  );
}
