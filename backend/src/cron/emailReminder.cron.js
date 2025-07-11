const cron = require('node-cron');
const { sendDeadlineReminder } = require('../../emailService');
const Task = require('../models/Task');
const User = require('../models/User');

module.exports = function startEmailReminderJob() {
  cron.schedule('* * * * *', async () => {
    console.log('🕒 Cron job: Đang kiểm tra công việc sắp hết hạn...');

    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

    const tasks = await Task.find({
      endTime: { $gte: now, $lte: nextHour },
      notified: { $ne: true }
    }).populate('user');

    for (const task of tasks) {
      const user = await User.findById(task.user);
      if (user?.email) {
        await sendDeadlineReminder(user.email, task);
        task.notified = true;
        await task.save();
        console.log(`📧 Đã gửi mail cho ${user.email} về công việc "${task.title}"`);
      }
    }

    console.log('✅ Cron job hoàn tất.\n');
  });
};
