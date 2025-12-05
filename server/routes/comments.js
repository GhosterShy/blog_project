import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.get('/:blogId/comments', async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId }).populate('author', 'username').sort({ createdAt: -1 });
  res.json(comments);
});

router.post('/:blogId/comments', protect, async (req, res) => {
  const { text } = req.body;
  const comment = new Comment({ text, author: req.user.id, blog: req.params.blogId });
  await comment.save();
  res.status(201).json(comment);
});

router.delete('/comments/:id', protect, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  await comment.deleteOne();
  res.json({ message: 'Deleted' });
});

export default router;