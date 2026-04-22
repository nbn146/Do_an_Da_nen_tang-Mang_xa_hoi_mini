import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App'; 
import { BrowserRouter } from 'react-router-dom'; 
import { GoogleOAuthProvider } from '@react-oauth/google';

// ĐÃ XÓA 2 DÒNG DOTENV Ở ĐÂY VÌ VITE TỰ ĐỘNG ĐỌC FILE .ENV RỒI

import './styles/tailwind.css'; 
import './styles/index.css'; 
import './styles/theme.css';

// Vite sẽ tự động hiểu dòng này mà không cần thư viện dotenv
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);