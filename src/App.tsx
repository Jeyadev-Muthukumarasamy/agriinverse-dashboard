import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Role from "../Components/Role/Role"
import Admin from "../Components/Admin/Admin"
import Sidebar from "../Components/Sidebar/Sidebar"
import Screen from "../Components/Screenviewanalytics/Screen"
import User from "../Components/User/User"
import './App.css'

// Layout component that includes the sidebar
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-6 pl-16">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Role />} />
        <Route path="/admin" element={<DashboardLayout><Admin /></DashboardLayout>} />
        <Route path="/screen" element={<DashboardLayout><Screen /></DashboardLayout>} />
        <Route path="/users" element={<DashboardLayout><User /></DashboardLayout>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App