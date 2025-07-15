require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes');
const catRoutes  = require('./src/routes/category.routes');
const taskRoutes = require('./src/routes/task');
const startEmailReminderJob = require('./src/cron/emailReminder.cron');

const { swaggerUi, swaggerSpec } = require('./src/config/swagger');


const app = express();
connectDB();

startEmailReminderJob();

//Middleware
// app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Route
app.use('/api/auth', authRoutes);            
app.use('/api/categories', catRoutes);        
app.use('/api/tasks', taskRoutes);           

//Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

//Server chạy
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Gửi email
const cron = require('node-cron');
const mongoose = require('mongoose');
const { sendDeadlineReminder } = require('./emailService');
const Task = require('./src/models/Task');
const User = require('./src/models/User');

//Chạy mỗi 15 phút
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

  const tasks = await Task.find({
    endTime: { $gte: now, $lte: nextHour },
    done: false,
    notified: { $ne: true } 
  }).populate('user');

  for (const task of tasks) {
    try {
      const user = await User.findById(task.user);
      if (user?.email) {
        await sendDeadlineReminder(user.email, task);
        task.notified = true;
        await task.save();
      }
    } catch (err) {
      console.error("Gửi email thất bại", err);
    }
  }
});
