import { TrendingUp, Users } from "lucide-react";

export function Sidebar() {
  return (
    <div className="sticky top-20 space-y-6">
      {/* Trending Topics */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Xu hướng</h3>
        </div>
        
        <div className="space-y-4">
          <div className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">#TechTrends2024</p>
              <span className="text-xs text-gray-500">🔥</span>
            </div>
            <p className="text-xs text-gray-500">12.5K bài viết</p>
          </div>
          
          <div className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">#TravelVietnam</p>
              <span className="text-xs text-gray-500">✈️</span>
            </div>
            <p className="text-xs text-gray-500">8.3K bài viết</p>
          </div>
          
          <div className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">#Foodie</p>
              <span className="text-xs text-gray-500">🍜</span>
            </div>
            <p className="text-xs text-gray-500">15.2K bài viết</p>
          </div>
          
          <div className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">#Photography</p>
              <span className="text-xs text-gray-500">📸</span>
            </div>
            <p className="text-xs text-gray-500">6.7K bài viết</p>
          </div>
          
          <div className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">#MusicVibes</p>
              <span className="text-xs text-gray-500">🎵</span>
            </div>
            <p className="text-xs text-gray-500">9.1K bài viết</p>
          </div>
        </div>
      </div>
      
      {/* Suggested Users */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Gợi ý kết bạn</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">Phương Linh</p>
              <p className="text-xs text-gray-500">@phuonglinh</p>
            </div>
            <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-all">
              Theo dõi
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">Quốc Huy</p>
              <p className="text-xs text-gray-500">@quochuy</p>
            </div>
            <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-all">
              Theo dõi
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop"
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">Bảo Trâm</p>
              <p className="text-xs text-gray-500">@baotram</p>
            </div>
            <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-all">
              Theo dõi
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop"
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">Minh Tuấn</p>
              <p className="text-xs text-gray-500">@minhtuan</p>
            </div>
            <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-all">
              Theo dõi
            </button>
          </div>
        </div>
        
        <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-semibold">
          Xem thêm
        </button>
      </div>
      
      {/* Footer Links */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-4">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <a href="#" className="hover:underline">Về chúng tôi</a>
          <span>•</span>
          <a href="#" className="hover:underline">Trợ giúp</a>
          <span>•</span>
          <a href="#" className="hover:underline">Điều khoản</a>
          <span>•</span>
          <a href="#" className="hover:underline">Quyền riêng tư</a>
        </div>
        <p className="text-xs text-gray-400 mt-2">© 2024 Social Mini</p>
      </div>
    </div>
  );
}
