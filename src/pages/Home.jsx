import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';

export default function Home() {
  const [blogs, setBlogs] = useState([]); // useState
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [loadining, setLoadining] = useState(true);

  useEffect(() => { 
    api(`/blogs?search=${search}`)
      .then(res => res.json())
      .then(setBlogs)
      .then(() => setLoadining(false));
  }, [search]);

  if (loadining) {
    return <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>;
  }




  return (
   <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Поиск по заголовку или содержимому..."
            value={search}
            onChange={(e) => setSearchParams({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {blogs.length === 0 ? (
          <div className="col-12 text-center py-5">
            <h3 className="text-muted">Блогов не найдено</h3>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="col">
              <div className="card h-100 shadow-sm hover-shadow transition">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{blog.title}</h5>
                  <p className="text-muted small mb-2">
                    Автор: <strong>{blog.author.username}</strong> •{' '}
                    {new Date(blog.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                  <p className="card-text text-secondary flex-grow-1">
                    {blog.content.substring(0, 120)}...
                  </p>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="btn btn-primary mt-3 align-self-start"
                  >
                    Читать далее →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}