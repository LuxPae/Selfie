import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUser, validateUsername, validateFullName } from "../scripts/userValidators.js"
import GlobalContext from "../context/GlobalContext.js"
import { TOKEN_EXPIRATION } from "../scripts/CONSTANTS.js"
import axios from "axios"
import dayjs from "dayjs"

const Register = () => {

  const { user, dispatchUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/home")
  }, [user])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: ""
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateUser(formData);
      //validateFullName(formData.fullName);
      //validateUsername(formData.username);
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        { ...formData },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("user", JSON.stringify({ ...response.data }));

      const expiration_date = dayjs().add(TOKEN_EXPIRATION, "hour")
      localStorage.setItem("tokenExpiration", expiration_date)

      dispatchUser({ type: "REGISTER", payload: response.data });
      navigate("/home");
    } catch (error) {
      localStorage.removeItem("user");
      if (error.message.includes("reading")) setError("Registazione fallita, errore del server");
      else setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="p-6 rounded w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center">Registrati</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400">Email<span className="text-red-400"> *</span></label>
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
            <label className="block text-gray-400">Password<span className="text-red-400"> *</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="********"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              autoComplete="new-password"
              required
              minLength="8"
              maxLength="16"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Nome Completo</label>
            <input
              type="textarea"
              name="fullName"
              value={formData.fullName}
              placeholder="Nome Cognome"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              maxLength="70"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Nome Utente<span className="text-red-400"> *</span></label>
            <input
              type="textarea"
              name="username"
              value={formData.username}
              placeholder="nome utente"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
              minLength="3"
              maxLength="20"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Registrati
          </button>
        </form>
        <p className="mt-4 text-center">
            Hai già un account? <Link to="/login" className="text-blue-500">Esegui l"accesso</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
