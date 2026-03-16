import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3000/api/auth/login", {
      username,
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
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;