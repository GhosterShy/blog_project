const API_BASE = process.env.NODE_ENV === 'production' 
  ? ''            
  : 'http://localhost:5000';  

export const api = (endpoint, options = {}) => {
  return fetch(`${API_BASE}/api${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
};