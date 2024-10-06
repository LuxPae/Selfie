import { useState, useEffect } from 'react';
import { useAuthContext } from "../hooks/useAuthContext.js"
import { useNavigate, Link } from 'react-router-dom';

import axios from "axios"

const BASE_URL = "http://localhost:5000/auth"

const Login = () => {
  const { user, dispatchUser } = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home")
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/login`, 
        { ...formData }, 
        { headers: { "Content-Type": "application/json" } }
      );
      //localStorage.setItem("user", JSON.stringify(response.data))
      dispatchUser({ type: "LOGIN", payload: response.data })
      navigate("/home");
    }
    catch (error) {
      console.error(error)
      setError(error.message)
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center">
          <div className="p-6 rounded w-full max-w-md">
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
