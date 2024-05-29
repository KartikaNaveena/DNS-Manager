import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:3000/route53/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/route53/register', { username, password, role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('User registered successfully');
      setUsername('');
      setPassword('');
      setRole('viewer');
    } catch (error) {
      setMessage('Error registering user');
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="manager">Manager</option>
            <option value="root">Root</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <h3>Existing Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagementPage;
