import { useState } from "react";
import { Search, TrendingUp, Clock, X } from "lucide-react";

interface SearchResult {
  id: string;
  type: "user" | "post" | "hashtag";
  title: string;
  subtitle?: string;
  image?: string;
  avatar?: string;
}

const trendingTopics = [
  { id: "1", tag: "ReactJS", posts: "125K bài viết" },
  { id: "2", tag: "WebDevelopment", posts: "89K bài viết" },
  { id: "3", tag: "TailwindCSS", posts: "67K bài viết" },
  { id: "4", tag: "TypeScript", posts: "54K bài viết" },
  { id: "5", tag: "AI", posts: "203K bài viết" },
  { id: "6", tag: "Design", posts: "156K bài viết" }
];

const recentSearches = [
  "Minh Anh",
  "#WebDesign",
  "Tuấn Kiệt",
  "#Photography"
];

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    type: "user",
    title: "Minh Anh",
    subtitle: "Graphic Designer • 2.5K người theo dõi",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "2",
    type: "user",
    title: "Minh Thu",
    subtitle: "Frontend Developer • 1.8K người theo dõi",
    avatar: "https://i.pravatar.cc/150?img=10"
  },
  {
    id: "3",
    type: "hashtag",
    title: "#MinhHoaThieuNien",
    subtitle: "15.2K bài viết"
  },
  {
    id: "4",
    type: "post",
    title: "Hướng dẫn thiết kế UI/UX cho người mới bắt đầu",
    subtitle: "Nguyễn Văn Minh • 234 lượt thích",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5"
  },
  {
    id: "5",
    type: "user",
    title: "Hoàng Minh",
    subtitle: "Content Creator • 3.2K người theo dõi",
    avatar: "https://i.pravatar.cc/150?img=15"
  }
];

export function SearchView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);

    if (query.length > 0) {
      // Filter mock results based on query
      const filtered = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleRemoveRecentSearch = (search: string) => {
    // Handle removing recent search
    console.log("Remove:", search);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm người dùng, bài viết, hashtag..."
              className="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {!isSearching ? (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Tìm kiếm gần đây</h3>
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{search}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveRecentSearch(search)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Xu hướng</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trendingTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 rounded-xl cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            #{topic.tag}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{topic.posts}</p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Kết quả tìm kiếm ({searchResults.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        {/* Avatar/Image/Icon */}
                        {result.type === "user" && result.avatar && (
                          <img
                            src={result.avatar}
                            alt={result.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        {result.type === "post" && result.image && (
                          <img
                            src={result.image}
                            alt={result.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        {result.type === "hashtag" && (
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-purple-600">#</span>
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {result.title}
                          </h4>
                          {result.subtitle && (
                            <p className="text-sm text-gray-600 truncate">
                              {result.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Type Badge */}
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {result.type === "user" && "Người dùng"}
                          {result.type === "post" && "Bài viết"}
                          {result.type === "hashtag" && "Hashtag"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thử tìm kiếm với từ khóa khác
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
