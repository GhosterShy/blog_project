import express from 'express';
import Blog from '../models/Blog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { search } = req.query;
  const query = search ? { title: { $regex: search, $options: 'i' } } : {};
  const blogs = await Blog.find(query).populate('author', 'username').sort({ createdAt: -1 });
  res.json(blogs);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'username');
  res.json(blog);
});

router.post('/', protect, async (req, res) => {
  const { title, content } = req.body;
  const blog = new Blog({ title, content, author: req.user.id });
  await blog.save();
  res.status(201).json(blog);
});

router.put('/:id', protect, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  blog.title = req.body.title;
  blog.content = req.body.content;
  await blog.save();
  res.json(blog);
});

router.delete('/:id', protect, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  await blog.deleteOne();
  res.json({ message: 'Deleted' });
});

export default router;