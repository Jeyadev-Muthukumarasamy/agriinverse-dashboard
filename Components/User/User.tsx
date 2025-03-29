import React, { useState, useEffect } from 'react';
import Search from '../Search/Search';
import axios from 'axios';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  mobileNumber: string;
  countryCode: string;
  countryName: string;
  dialCode: string;
  flagUrl: string;
  isLoggedIn: boolean;
  crop: string;
  yieldType: number;
  environmentType: string;
  cultivationType: string;
  createdAt: string;
  free: boolean;
}

interface NotificationState {
  isOpen: boolean;
  message: string;
  selectedUserId: number | null;
}

const User: React.FC = () => {
  const [userData, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: '',
    selectedUserId: null
  });
 

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/user/getUser');
      
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        setError(null);
      } else {
        setError('Failed to fetch users: Invalid response format');
        console.error('Invalid API response:', response.data);
      }
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredUsers(userData);
      return;
    }
    const filtered = userData.filter(user => 
      user.mobileNumber.toLowerCase().includes(query.toLowerCase()) ||
      user.countryName.toLowerCase().includes(query.toLowerCase()) ||
      user.crop.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSendNotification = async (userId: number) => {
    if (!notification.message.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/admin/notification/createNotification', {
        userId: userId,
        message: notification.message
      });
      console.log(response,"this is response")

      if (response.data.success) {
        setNotification({
          isOpen: false,
          message: '',
          selectedUserId: null
        });
        // You could add a success message here
      }
    } catch (error) {
      setError('Failed to send notification');
      console.error('Error sending notification:', error);
    }
  };

  

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(userData);
  }, [userData]);

  const handleLogout = async (userId: number) => {
    try {
      console.log(`Logging out user: ${userId}`);
      // await axios.post(`http://localhost:3001/a  pi/user/logout/${userId}`);
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600">Monitor and manage user activities</p>
          </div>
          <div className="w-72">
            <Search onSearch={handleSearch} value={searchQuery} />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-green-600">{userData.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-blue-600">
            {userData.filter(user => user.isLoggedIn).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Free Users</p>
          <p className="text-2xl font-bold text-yellow-600">
            {userData.filter(user => user.free).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Unique Crops</p>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(userData.map(user => user.crop)).size}
          </p>
        </div>
      </div>


      

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} 
               className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                    {user.mobileNumber.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{user.mobileNumber}</h3>
                    <p className="text-white/80 text-sm">{user.crop}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setNotification({
                      isOpen: true,
                      message: '',
                      selectedUserId: user.id
                    })}
                    className="text-sm bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Notify
                  </button>
                  <button 
                    onClick={() => handleLogout(user.id)}
                    className="text-sm bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="text-sm font-medium">{user.countryName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Crop</p>
                  <p className="text-sm font-medium truncate">{user.crop}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span>Details</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    {user.environmentType}
                  </span>
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    {user.cultivationType}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Yield Type: {user.yieldType}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notification.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Send Notification</h3>
              <button
                onClick={() => setNotification({
                  isOpen: false,
                  message: '',
                  selectedUserId: null
                })}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <textarea
              value={notification.message}
              onChange={(e) => setNotification({
                ...notification,
                message: e.target.value
              })}

              placeholder="Enter your notification message..."
              className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setNotification({
                  isOpen: false,
                  message: '',
                  selectedUserId: null
                })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => notification.selectedUserId && handleSendNotification(notification.selectedUserId)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
