import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const { loading, handleRegister } = useAuth()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister(username, email, password)
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
                    Register
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Enter username"
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email address"
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Enter password"
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <button
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

        </main>
    )
}

export default Register