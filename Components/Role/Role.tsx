import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Role = () => {
    const [role, setRole] = useState<String>('')
    const navigate = useNavigate()

    const handleRoleSelect = (selectedRole: string) => {
        setRole(role)
        localStorage.setItem('role', selectedRole)
        navigate('/admin', { state: { role: selectedRole } })
    }
    
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4'>
            <div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>
                        Select Your Role
                    </h1>
                    <p className='text-gray-600'>
                        Choose the appropriate role to access your dashboard
                    </p>
                </div>
                
                <div className='flex flex-col space-y-4'>
                    <button 
                        className='transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg' 
                        onClick={() => handleRoleSelect('admin')}
                    >
                        {/* ...existing SVG code... */}
                        <span>Admin</span>
                    </button>
                    
                    <button 
                        className='transition-all duration-200 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg' 
                        onClick={() => handleRoleSelect('user')}
                    >
                        {/* ...existing SVG code... */}
                        <span>User</span>
                    </button>
                    
                    <button 
                        className='transition-all duration-200 bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg' 
                        onClick={() => handleRoleSelect('developer')}
                    >
                        {/* ...existing SVG code... */}
                        <span>Developer</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Role