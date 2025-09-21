
import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// Create Task
router.post('/', auth, async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  try {
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user.id
    });
    await task.save();
    if (assignedTo) {
      await User.findByIdAndUpdate(assignedTo, { $push: { tasks: task._id } });
    }
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Tasks (with pagination)
router.get('/', auth, async (req, res) => {
  const { page = 1, limit = 10, status, priority } = req.query;
  const query = { createdBy: req.user.id };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  try {
    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('assignedTo', 'username');
    const count = await Task.countDocuments(query);
    res.json({ tasks, total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Task Details
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'username');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit Task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.assignedTo) {
      await User.findByIdAndUpdate(task.assignedTo, { $pull: { tasks: task._id } });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Task Status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Move Task Priority
router.patch('/:id/priority', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { priority: req.body.priority }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
