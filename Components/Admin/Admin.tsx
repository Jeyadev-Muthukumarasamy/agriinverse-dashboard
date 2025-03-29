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
        mobileNumber: '',
        password: ''
    })

    const [error, setError] = useState({
        mobileNumber: false,
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
        if (error.mobileNumber || error.password) return

        try {
            if (role === 'admin') {
                if (data.mobileNumber === '9876543210' && data.password === '123456') {
                    console.log("Admin login successful")
                    // Add navigation or success handling here
                } else {
                    setError({ mobileNumber: true, password: true })
                    console.log("Admin login failed")
                }
            } 
            else if (role === 'developer') {
                // Add developer login logic here
                console.log("Developer login not implemented")
            } 
            else if (role === 'user') {
                const response = await axios.post('https://agriinverse-api.vercel.app/api/user/login', {
                    mobileNumber: data.mobileNumber,
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
            setError({ mobileNumber: true, password: true })
        }
    }

    const handleValidation = () => {
        const newError = {
            mobileNumber: !data.mobileNumber || data.mobileNumber.length < 10,
            password: !data.password || data.password.length < 6
        }
        setError(newError)
        return !newError.mobileNumber && !newError.password
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
                            Mobile Number
                        </label>
                        <div className='relative'>
                            <input
                                type="tel"
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm'
                                placeholder='Enter your mobile number'
                                required
                                onChange={handleChange}
                                name="mobileNumber"
                                value={data.mobileNumber}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {error.mobileNumber && <p className='text-sm text-red-500 mt-1'>Please enter a valid mobile number</p>}
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
