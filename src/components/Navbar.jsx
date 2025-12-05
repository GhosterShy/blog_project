import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../App.js';

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

  const logout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
  };

  const isActive = (path) => location.pathname === path ? 'active fw-bold' : '';
  return (
   <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        {/* Логотип / Название */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Мой Блог
        </Link>

        {/* Бургер-кнопка для мобильных */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Меню */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                Главная
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/profile')}`} to="/profile">
                    Профиль
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    onClick={logout}
                    className="btn btn-outline-light ms-3 px-4"
                  >
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/login')}`} to="/login">
                    Войти
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`btn btn-outline-light ms-3 px-4 ${isActive('/register')}`}
                    to="/register"
                  >
                    Регистрация
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}