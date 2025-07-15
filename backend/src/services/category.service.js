const Category = require('../models/Category');
const Task     = require('../models/Task');

// Tạo mới category
exports.createCategory = (userId, name) =>
  Category.create({ name, user: userId });

// Xóa category
exports.deleteCategory = (userId, catId) =>
  Category.findOneAndDelete({ _id: catId, user: userId });

// Thêm task mới vào category
exports.addTask = async (userId, catId, data) => {
  const cat = await Category.findOne({ _id: catId, user: userId });
  if (!cat) throw new Error('Category not found');

  const { startTime, endTime } = data;
  if (new Date(endTime) <= new Date(startTime)) {
    throw new Error('End time must be after start time');
  }

  const task = await Task.create({
    ...data,
    category: catId,
    user: userId
  });

  cat.tasks = cat.tasks || [];
  cat.tasks.push(task._id);
  await cat.save();

  return task;
};

// Xóa task trong category
exports.deleteTask = async (userId, catId, taskId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, category: catId });

  if (!task) {
    throw new Error('Task not found or does not belong to the specified category');
  }

  await Category.updateOne(
    { _id: catId, user: userId },
    { $pull: { tasks: taskId } }
  );

  return task;
};

// Cập nhật trạng thái "done" của task
exports.updateTaskStatus = async (userId, catId, taskId, done) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, category: catId },
    { done },
    { new: true }
  );
  if (!task) throw new Error('Task not found');
  return task;
};

// Lấy tất cả category của user (có populate tasks)
exports.getCategories = async (userId) => {
  return await Category.find({ user: userId }).populate('tasks');
};
// Sửa toàn bộ nội dung task
exports.updateTaskDetails = async (userId, catId, taskId, updatedData) => {
  const { startTime, endTime } = updatedData;
  if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
    throw new Error('End time must be after start time');
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, category: catId, user: userId },
    updatedData,
    { new: true }
  );

  if (!task) throw new Error('Task not found or you do not have permission');
  return task;
};


