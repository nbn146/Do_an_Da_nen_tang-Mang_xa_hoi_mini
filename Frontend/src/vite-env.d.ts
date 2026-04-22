/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  // Sau này bạn thêm biến nào vào .env thì khai báo thêm ở đây nhé
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}