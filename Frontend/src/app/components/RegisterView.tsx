import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AtSign } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { authService } from "../../services/authService";
import { useTranslation } from "react-i18next";

export function RegisterView() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
   const { t } = useTranslation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setError(t("auth.PASSWORD_MISMATCH"));
      return;
    }

    // 2. Thuật toán nhận diện Email hay Số điện thoại (Regex)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    // Nhận diện số điện thoại chuẩn Việt Nam (Bắt đầu bằng 0 hoặc 84, gồm 10 số)
    const isPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(contact); 

    if (!isEmail && !isPhone) {
      setError(t("auth.INVALID_CONTACT_FORMAT"));
      return;
    }

    setError(""); // Xóa lỗi cũ nếu có

    try {
      // 3. Đóng gói dữ liệu gửi xuống Backend
      const userData: any = {
        display_name: displayName,
        username: username,
        password: password,
        email: isEmail ? contact : null,
        phone_number: isPhone ? contact : null
      };

      // 4. Gọi API Backend
      console.log("Chuẩn bị gửi dữ liệu này đi:", userData);
      const data = await authService.register(userData);
      
      
      alert(data.message || "Đăng ký thành công! Đang chuyển hướng...");
      
      // 5. Thành công thì chuyển về trang Login
      navigate("/login");

    } catch (error: any) {
      // Bắt lỗi từ Backend (VD: Trùng username, trùng email...)
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký!');
    }
  };
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Animated gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-7">
          <div className="text-center mb-5">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Tạo tài khoản</h2>
            <p className="text-gray-500">Tham gia cùng cộng đồng của chúng tôi</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng (Username)</label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  placeholder="Nhập tên người dùng"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email hoặc Số điện thoại</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  placeholder="Nhập email hoặc số điện thoại"
                />
              </div>
            </div>

          
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"} // Thay đổi type dựa trên state
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-12 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          placeholder="Nhập mật khẩu"
        />
        {/* Nút bật/tắt mắt */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>

      <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"} // Thay đổi type dựa trên state
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full pl-12 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          placeholder="Nhập lại mật khẩu"
        />
        {/* Nút bật/tắt mắt */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
          

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium group"
            >
              <span>Đăng ký ngay</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
