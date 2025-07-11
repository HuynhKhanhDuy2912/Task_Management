// testEmailReminder.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const { sendDeadlineReminder } = require('./emailService');
const Task = require('./src/models/Task');
const User = require('./src/models/User');

(async () => {
  try {
    await connectDB();

    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000); // 1 giờ sau

    const tasks = await Task.find({
        endTime: { $gte: now, $lte: nextHour },
        notified: { $ne: true }
    }).populate('user');


    console.log(`🕒 Đang kiểm tra ${tasks.length} công việc gần đến hạn...`);

    for (const task of tasks) {
      const user = await User.findById(task.user);
      if (user?.email) {
        await sendDeadlineReminder(user.email, task);
        task.notified = true;
        await task.save();
        console.log(`📧 Đã gửi mail cho ${user.email} về công việc "${task.title}"`);
      } else {
        console.log(`⚠️ Không tìm thấy email của user: ${task.user}`);
      }
    }

    console.log("✅ Hoàn tất kiểm tra và gửi email.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi gửi email:", err);
    process.exit(1);
  }
})();
