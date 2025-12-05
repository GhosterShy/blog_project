import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../App.js';

export default function Profile() {
  const { user } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/blogs')
      .then(res => res.json())
      .then(allBlogs => setBlogs(allBlogs.filter(b => b.author._id === user._id)));
  }, [user]);

  const deleteBlog = async (id) => {
    // Используем window.confrict вместо просто confirm
    if (window.confirm('Удалить?')) {
      await fetch(`http://localhost:5000/api/blogs/${id}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });
      setBlogs(blogs.filter(b => b._id !== id));
    }
  };

  return (
   <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Карточка профиля */}
          <div className="card shadow-sm mb-5">
            <div className="card-body">
              <h1 className="card-title display-5 fw-bold mb-3">
                Профиль: {user.username}
              </h1>
              <p className="lead text-muted mb-4">
                <strong>Email:</strong> {user.email}
              </p>

              <Link
                to="/blog/create"
                className="btn btn-primary btn-lg px-5"
              >
                Создать новый блог
              </Link>
            </div>
          </div>

          {/* Список блогов */}
          <h2 className="mb-4 fw-bold fs-3">Мои блоги</h2>

          {blogs.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <h4>У вас пока нет блогов</h4>
              <p className="mb-0">Создайте свой первый пост прямо сейчас!</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {blogs.map(blog => (
                <div key={blog._id} className="col">
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{blog.title}</h5>
                      
                      <p className="text-muted small mb-3">
                        {new Date(blog.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>

                      <p className="card-text text-secondary flex-grow-1">
                        {blog.content.substring(0, 130)}...
                      </p>

                      <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Читать полностью
                        </Link>

                        <div>
                          <Link
                            to={`/blog/edit/${blog._id}`}
                            className="btn btn-outline-secondary btn-sm me-2"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => deleteBlog(blog._id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}