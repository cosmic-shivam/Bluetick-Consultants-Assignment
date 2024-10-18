import React, { useState, useEffect } from 'react';

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  age: number;
  marital_status: string;
  is_employed: boolean;
  is_founder: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    first_name: '',
    last_name: '',
    username: '',
    age: 0,
    marital_status: 'unmarried',
    is_employed: false,
    is_founder: false,
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://mocki.io/v1/a6a0fb6b-a84a-4934-b3f2-5c92cc77c44e');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addUser = () => {
    if (newUser.first_name && newUser.last_name && newUser.username) {
      const updatedUsers = [...users, { ...newUser, id: users.length + 1 }];
      setUsers(updatedUsers);
      setNewUser({
        first_name: '',
        last_name: '',
        username: '',
        age: 0,
        marital_status: 'unmarried',
        is_employed: false,
        is_founder: false,
      });
    }
  };

  const editUser = () => {
    if (editingUser) {
      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
    }
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Portal</h1>
      
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Add User Form */}
      <div className="mb-6 p-6 border rounded-lg bg-gray-100 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="First Name"
            value={newUser.first_name}
            onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
          />
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Last Name"
            value={newUser.last_name}
            onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
          />
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="number"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Age"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: Number(e.target.value) })}
          />
          <select
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newUser.marital_status}
            onChange={(e) => setNewUser({ ...newUser, marital_status: e.target.value })}
          >
            <option value="unmarried">Unmarried</option>
            <option value="married">Married</option>
          </select>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newUser.is_employed}
              onChange={(e) => setNewUser({ ...newUser, is_employed: e.target.checked })}
              className="text-blue-500 focus:ring-blue-400"
            />
            <label className="ml-2">Employed</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newUser.is_founder}
              onChange={(e) => setNewUser({ ...newUser, is_founder: e.target.checked })}
              className="text-blue-500 focus:ring-blue-400"
            />
            <label className="ml-2">Founder</label>
          </div>
          <button
            onClick={addUser}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add User
          </button>
        </div>
      </div>

      {/* User List */}
      {users.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Founder</th>
                <th className="w-1/4 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {`${user.first_name} ${user.last_name}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.is_employed ? 'Employed' : 'Unemployed'}, {user.marital_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.is_founder ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-blue-600 hover:text-blue-900 transition duration-200 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id!)}
                      className="text-red-600 hover:text-red-900 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-8">No users found.</div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <input
              type="text"
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser.first_name}
              onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
            />
            <input
              type="text"
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser.last_name}
              onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
            />
            <input
              type="text"
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser.username}
              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
            />
            <input
              type="number"
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser.age}
              onChange={(e) => setEditingUser({ ...editingUser, age: Number(e.target.value) })}
            />
            <select
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser.marital_status}
              onChange={(e) => setEditingUser({ ...editingUser, marital_status: e.target.value })}
            >
              <option value="unmarried">Unmarried</option>
              <option value="married">Married</option>
            </select>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={editingUser.is_employed}
                onChange={(e) => setEditingUser({ ...editingUser, is_employed: e.target.checked })}
                className="text-blue-500 focus:ring-blue-400"
              />
              <label className="ml-2">Employed</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={editingUser.is_founder}
                onChange={(e) => setEditingUser({ ...editingUser, is_founder: e.target.checked })}
                className="text-blue-500 focus:ring-blue-400"
              />
              <label className="ml-2">Founder</label>
            </div>
            <div className="flex justify-end">
              <button
                onClick={editUser}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 ml-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
