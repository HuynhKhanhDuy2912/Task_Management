const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, async (req, res) => {
  try {

    const { title, content, startTime, endTime, done, categoryId } = req.body;

    if (!req.user?.id) {
      console.error("Thiếu user id trong req");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !startTime || !endTime || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newTask = new Task({
      title,
      content,
      startTime,
      endTime,
      done: done || false,
      category: categoryId,
      user: req.user.id
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ message: 'Failed to save task' });
  }
});

module.exports = router;
