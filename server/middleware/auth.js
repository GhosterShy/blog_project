// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };  // ← важно: именно decoded.id
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Токен недействителен' });
  }
};