import React, { useState, useEffect } from 'react';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  lastActive: string;
}

interface SearchProps {
  onSearch: (query: string) => void;
  value: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, value }) => {
  return (
    <input
      type="text"
      placeholder="Search users..."
      value={value}
      onChange={(e) => onSearch(e.target.value)}
      className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  );
};

export default Search;

// SearchComponent is now a separate exportable component
export const SearchComponent: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const mockUsers: UserData[] = [
    { id: '1', username: 'john_doe', email: 'john@example.com', role: 'Admin', lastActive: '2024-01-20' },
    { id: '2', username: 'jane_smith', email: 'jane@example.com', role: 'User', lastActive: '2024-01-19' },
    { id: '3', username: 'bob_wilson', email: 'bob@example.com', role: 'User', lastActive: '2024-01-18' },
  ];

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // API integration
      // const response = await axios.get('http://localhost/api/v1/user');
      // setUsers(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setUsers(mockUsers);
        setError(null);
      }, 500);
    } catch (error) {
      setError('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="relative">
          <Search onSearch={handleSearch} value={search} />
          {loading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 text-red-500 text-sm">{error}</div>
        )}
      </div>

      {search && (
        <>
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{user.username}</h3>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === 'Admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Last active: {user.lastActive}
                  </p>
                </div>
              ))}
            </div>
          ) : !loading && (
            <div className="text-center text-gray-500 py-8">
              No users found matching "{search}"
            </div>
          )}
        </>
      )}

      {!search && !loading && (
        <div className="text-center text-gray-400 py-8">
          Type to search for users
        </div>
      )}
    </div>
  );
};
