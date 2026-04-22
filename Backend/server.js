import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import authRoutes from './src/routes/authRoutes.js';

const app = express();

// Middleware cơ bản
app.use(cors());
app.use(express.json()); // Cho phép API đọc dữ liệu gửi lên dạng JSON

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Chuẩn OpenAPI 3.0
    info: {
      title: 'MiniSocial API',
      version: '1.0.0',
      description: 'Tài liệu API cho đồ án mạng xã hội MiniSocial',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      }
    ],
    // Khai báo nút "Authorize" để nhập Token JWT sau này
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  // Nơi Swagger sẽ đọc các file để tự động tạo tài liệu
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
// Tạo đường dẫn /api-docs để truy cập giao diện Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);

// Kết nối với MongoDB Atlas
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('🚀 Đã kết nối thành công với MiniSocialDB trên Atlas!'))
  .catch((err) => console.error('Lỗi kết nối Database:', err));

// Route test thử
app.get('/', (req, res) => {
  res.send('MiniSocial API đang hoạt động ngon lành!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});