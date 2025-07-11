const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendDeadlineReminder(toEmail, task) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `🔔 TaskManagement - Nhắc nhở công việc gần đến hạn!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f6f6f6;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: #4CAF50; padding: 20px; color: white; text-align: center;">
            <h1 style="margin: 0;">TaskManagement</h1>
            <p>Trợ lý quản lý công việc của bạn</p>
          </div>
          <div style="padding: 20px;">
            <h2>🔔 Bạn có một công việc sắp đến hạn!</h2>
            <p><strong>Tiêu đề:</strong> ${task.title}</p>
            <p><strong>Nội dung:</strong> ${task.content || "Không có"}</p>
            <p><strong>Thời hạn:</strong> ${new Date(task.endTime).toLocaleString('vi-VN')}</p>
            <hr />
            <p style="color: #888;">Hãy đảm bảo bạn hoàn thành đúng hạn nhé!</p>
          </div>
          <div style="background: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #777;">
            TaskMate © 2025 - Quản lý công việc hiệu quả
          </div>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendDeadlineReminder };
