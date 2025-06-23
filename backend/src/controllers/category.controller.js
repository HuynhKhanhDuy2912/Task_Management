const catService = require('../services/category.service');
const Task = require('../models/Task'); // ✅ Thêm dòng này vào đầu file
const mongoose = require('mongoose');

exports.createCategory = async (req, res, next) => {
  try {
    const cat = await catService.createCategory(req.user.id, req.body.name);
    res.status(201).json(cat);
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await catService.deleteCategory(req.user.id, req.params.id);
    res.sendStatus(204);
  } catch (err) { next(err); }
};

exports.addTask = async (req, res, next) => {
  try {
    const task = await catService.addTask(req.user.id, req.params.id, req.body);
    res.status(201).json(task);
  } catch (err) { next(err); }
};



exports.deleteTask = async (req, res) => {
  try {
    const { id: categoryId, tid: taskId } = req.params;

    // Ép kiểu ObjectId để so sánh đúng trong MongoDB
    const task = await Task.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(taskId),
      category: new mongoose.Types.ObjectId(categoryId)
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or does not belong to the specified category' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error in deleteTask:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.updateTask = async (req, res, next) => {
  try {
    const task = await catService.updateTaskStatus(
      req.user.id,
      req.params.id,     // categoryId
      req.params.tid,    // ✅ taskId (phải là .tid, KHÔNG phải .taskId)
      req.body.done
    );
    res.json(task);
  } catch (err) {
    next(err);  // Bạn có thể log ra console cho rõ hơn nếu cần
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await catService.getCategories(req.user.id);
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getTasksByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const tasks = await Task.find({ category: categoryId }).sort({ startTime: 1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks by category:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
