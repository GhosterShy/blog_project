import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../App.js';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then(res => res.json())
      .then(setBlog);
    fetch(`/api/blogs/${id}/comments`)
      .then(res => res.json())
      .then(setComments);
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    const res = await fetch(`api/blogs/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text: newComment })
    });
    if (res.ok) {
      const comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  if (!blog) return <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>;

  return (
   <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">

          {/* Заголовок и мета */}
          <article className="card border-0 shadow-sm mb-5">
            <div className="card-body p-5">
              <h1 className="display-4 fw-bold mb-4">{blog.title}</h1>
              
              <div className="d-flex align-items-center text-muted mb-5">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px', fontSize: '1.4rem' }}>
                  {blog.author.username[0].toUpperCase()}
                </div>
                <div>
                  <strong>{blog.author.username}</strong><br/>
                  <small>{new Date(blog.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</small>
                </div>
              </div>

              <div className="lead fs-4 text-dark" style={{ lineHeight: '1.8' }}>
                {blog.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph || <br/>}</p>
                ))}
              </div>
            </div>
          </article>

          {/* Комментарии */}
          <section className="mt-5">
            <h2 className="fs-3 fw-bold mb-4">
              Комментарии ({comments.length})
            </h2>

            {/* Форма добавления комментария */}
            {user ? (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <form onSubmit={addComment}>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Напишите ваш комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary px-5">
                      Отправить
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="alert alert-light border">
                <strong>Хотите оставить комментарий?</strong>{' '}
                <a href="/login" className="alert-link">Войдите</a> или{' '}
                <a href="/register" className="alert-link">зарегистрируйтесь</a>
              </div>
            )}

            {/* Список комментариев */}
            <div className="row row-cols-1 g-4">
              {comments.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <h5>Пока нет комментариев</h5>
                  <p>Станьте первым!</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment._id} className="col">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-start">
                          <div className="bg-success text-white rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center me-3"
                               style={{ width: '42px', height: '42px' }}>
                            {comment.author.username[0].toUpperCase()}
                          </div>
                          <div className="flex-grow-1">
                            <strong>{comment.author.username}</strong>
                            <small className="text-muted ms-2">
                              {new Date(comment.createdAt).toLocaleDateString('ru-RU')} в{' '}
                              {new Date(comment.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </small>
                            <p className="mt-2 mb-0">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}