import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, content })
    });
    navigate('/profile');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 border rounded">
      <h2 className="text-2xl mb-4">Новый блог</h2>
      <input type="text" placeholder="Заголовок" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border mb-4" required />
      <textarea placeholder="Содержание" value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border mb-4 h-40" required />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Опубликовать</button>
    </form>
  );
}