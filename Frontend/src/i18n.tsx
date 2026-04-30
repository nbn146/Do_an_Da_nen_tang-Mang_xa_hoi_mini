import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Import trực tiếp các file JSON từ điển của bạn vào đây
// Giả sử bạn tạo file vi.json ở thư mục src/locales/vi.json
import viLang from './locales/vi.json';
import enLang from './locales/en.json'; // Nếu có tiếng Anh

i18n
  .use(initReactI18next) // Truyền instance của i18n vào react-i18next
  .init({
    // 2. Cấu hình nguồn dữ liệu dịch
    resources: {
      vi: { translation: viLang },
      en: { translation: enLang }
    },
    lng: 'vi', // Ngôn ngữ mặc định khi vừa vào web
    fallbackLng: 'vi', // Nếu lỗi hoặc không tìm thấy key, nó sẽ dùng tiếng Việt
    interpolation: {
      escapeValue: false, // React đã tự động chống XSS bảo mật rồi nên không cần thiết
    },
  });

export default i18n;