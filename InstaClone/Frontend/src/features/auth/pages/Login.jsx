import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin(username, password)
        navigate('/')
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <h1 className="text-xl font-semibold">Loading...</h1>
            </main>
        )
    }

    return (

        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-md w-96">

                <h1 className="text-2xl font-bold text-center mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Enter username"
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Enter password"
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
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
                        Create One
                    </Link>
                </p>

            </div>

        </main>
    )
}

export default Login