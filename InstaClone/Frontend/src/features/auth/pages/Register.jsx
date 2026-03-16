import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3000/api/auth/register", {
      username,
      email,
      password
    }, {
      withCredentials: true
    })
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h1 className="text-2xl font-bold text-center mb-6">
          Register
        </h1>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;