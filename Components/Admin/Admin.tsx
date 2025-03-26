import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

interface LocationState {
    role: string;
}

const Admin = () => {
    const location = useLocation();
    const { role } = location.state as LocationState;

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState({
        email: false,
        password: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value })
        setError({ ...error, [e.target.name]: false }) // Reset error when user types
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Validate before submitting
        handleValidation()
        if (error.email || error.password) return

        try {
            if (role === 'admin') {
                if (data.email === 'vasanth@gmail.com' && data.password === '123456') {
                    console.log("Admin login successful")
                    // Add navigation or success handling here
                } else {
                    setError({ email: true, password: true })
                    console.log("Admin login failed")
                }
            } 
            else if (role === 'developer') {
                // Add developer login logic here
                console.log("Developer login not implemented")
            } 
            else if (role === 'user') {
                const response = await axios.post('http://localhost:5000/api/user/login', {
                    email: data.email,
                    password: data.password
                })
                
                if (response.status === 200) {
                    console.log("User login successful")
                    localStorage.setItem('token', response.data.token)
                    // Add navigation or success handling here
                }
            }
        } catch (error) {
            console.log("Login failed", error)
            setError({ email: true, password: true })
        }
    }

    const handleValidation = () => {
        const newError = {
            email: !data.email || !/\S+@\S+\.\S+/.test(data.email),
            password: !data.password || data.password.length < 6
        }
        setError(newError)
        return !newError.email && !newError.password
    }


  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center p-4'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3'>
                        Welcome Back
                    </h1>
                    <p className='text-gray-600'>
                        Please enter your credentials to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Email Address
                        </label>
                        <div className='relative'>
                            <input
                                type="email"
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm'
                                placeholder='Enter your email'
                                required
                                onChange={handleChange}
                                name="email"
                                value={data.email}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            {error.email && <p className='text-sm text-red-500 mt-1'>Please enter a valid email</p>}
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                type="password"
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm'
                                placeholder='Enter your password'
                                required
                                onChange={handleChange}
                                name="password"
                                value={data.password}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {error.password && <p className='text-sm text-red-500 mt-1'>Please enter a valid password</p>}
                        </div>
                    </div>

                    <div className='pt-2'>
                        <button
                            type="submit"
                            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        >
                            Sign In
                        </button>
                    </div>

                    <div className='text-center mt-6 border-t pt-4'>
                        <a href="#" className='text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200'>
                            Forgot your password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default Admin