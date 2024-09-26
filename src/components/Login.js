import React, { useState, useContext } from 'react';
import GlobalContext from "../context/GlobalContext.js"
import { login } from "../scripts/authentication.js"
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { setUser } = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          setUser(await login({ ...formData }));
          navigate('/home');
      } catch (error) {
          setError(error.message);
          console.log(error);
      }
  };

  return (
      <div className="min-h-screen flex items-center justify-center">
          <div className="p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-2xl mb-6 text-center">Login</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                      <label className="block text-gray-400">Email</label>
                      <input
                          type="email"
                          name="email"
                          value={formData.email}
                          placeholder="nome@compagnia.com"
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1"
                          autoComplete="email"
                          required
                      />
                  </div>
                  <div className="mb-6">
                      <label className="block text-gray-400">Password</label>
                      <input
                          type="password"
                          name="password"
                          value={formData.password}
                          placeholder="********"
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1"
                          autoComplete="current-password"
                          required
                      />
                  </div>
                  <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                      Login
                  </button>
              </form>
              <p className="mt-4 text-center">
                  Non hai un account? <Link to="/register" className="text-blue-500">Registrati ora!</Link>
              </p>
          </div>
      </div>
  );
};

export default Login;
