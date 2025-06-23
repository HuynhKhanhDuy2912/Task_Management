const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String },
  startTime: { type: Date,   required: true },
  endTime:   { type: Date,   required: true },
  done:      { type: Boolean, default: false },
  category:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);