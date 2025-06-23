require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes');
const catRoutes  = require('./src/routes/category.routes');
const taskRoutes = require('./src/routes/task');

const app = express();
connectDB();

// ✅ Middleware
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json());

// ✅ Route rõ ràng
app.use('/api/auth', authRoutes);             // /api/auth/...
app.use('/api/categories', catRoutes);        // 👈 CHỈNH chỗ này
app.use('/api/tasks', taskRoutes);            // /api/tasks/...

// ✅ Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// ✅ Server chạy
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
