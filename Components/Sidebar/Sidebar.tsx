import { useState } from 'react'
import { IconType } from 'react-icons'
import { FiUsers, FiMap, FiLogOut, FiPieChart, FiBell, FiSmartphone, FiDollarSign, FiClock, FiMenu, FiX, FiHome, FiSettings } from 'react-icons/fi'
import { FaLeaf } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

interface MenuItem {
    title: string;
    icon: IconType;
    path: string;
}

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()
    const role = localStorage.getItem('role') || 'admin'

    const adminMenuItems: MenuItem[] = [
        { title: 'Dashboard', icon: FiHome, path: '/admin' },
        { title: 'User Location', icon: FiMap, path: '/location' },
        { title: 'Farm Data', icon: FaLeaf, path: '/farm' },
        { title: 'Analytics', icon: FiPieChart, path: '/screen' },
        { title: 'Notifications', icon: FiBell, path: '/notifications' },
        { title: 'Devices', icon: FiSmartphone, path: '/devices' },
        { title: 'User Cost', icon: FiDollarSign, path: '/cost' },
        { title: 'Time Analysis', icon: FiClock, path: '/time' },
        { title: 'Settings', icon: FiSettings, path: '/settings' },
        { title: 'Logout', icon: FiLogOut, path: '/logout' },
    ]

    const userMenuItems: MenuItem[] = adminMenuItems.filter(item => 
        !['User Location', 'Farm Data'].includes(item.title)
    )

    const developerMenuItems: MenuItem[] = [
        { title: 'Dashboard', icon: FiHome, path: '/admin' },
        { title: 'Devices', icon: FiSmartphone, path: '/devices' },
        { title: 'Settings', icon: FiSettings, path: '/settings' },
        { title: 'Logout', icon: FiLogOut, path: '/logout' }
    ]

    const getMenuItems = () => {
        switch(role) {
            case 'admin': return adminMenuItems
            case 'user': return userMenuItems
            case 'developer': return developerMenuItems
            default: return adminMenuItems
        }
    }

    return (
        <>
            {/* Hamburger Button - Visible on all screen sizes */}
            <button 
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-0'} z-40`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo/Header */}
                    <div className="flex items-center justify-center h-20 bg-gradient-to-r from-green-600 to-green-500">
                        <div className="flex items-center space-x-2">
                            <FaLeaf className="h-8 w-8 text-white" />
                            <h1 className="text-2xl font-bold text-white">AgriInverse</h1>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="px-4 py-6 border-b border-gray-700">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <FiUsers className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{role?.toUpperCase()}</p>
                                <p className="text-xs text-gray-400">Active Now</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4">
                        <div className="mb-4 px-2">
                            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Main Menu</h3>
                        </div>
                        <ul className="space-y-1">
                            {getMenuItems().map((item, index) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={index}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center p-3 rounded-lg group transition-colors duration-200
                                                ${isActive 
                                                ? 'bg-green-600 text-white' 
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                        >
                                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                            <span className="ml-3 font-medium">
                                                {item.title}
                                            </span>
                                            {item.title === 'Notifications' && (
                                                <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    3
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700 text-center">
                        <p className="text-xs text-gray-400">© 2023 AgriInverse. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar