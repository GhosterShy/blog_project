import { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import BlogDetail from './pages/BlogGetail.jsx';
import CreateBlog from './pages/CreateBlog.jsx';
import EditBlog from './pages/EditBlog.jsx';
import { api } from './api.js';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation(); 
  useEffect(() => {
    api('/auth/me', { 
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
      })
  }, []);

  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blog/create" element={user ? <CreateBlog /> : <Navigate to="/login" />} />
          <Route path="/blog/edit/:id" element={user ? <EditBlog /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;