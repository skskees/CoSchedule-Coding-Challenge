import React, { useState } from 'react';
import api from '../api/api';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post('/user/login', form);
      localStorage.setItem('token', res.data.token);
      console.log(res.data.token)
      localStorage.setItem('userID', res.data.userId)
      console.log(res.data.userId)
      alert('Logged in successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Invalid username or password');
    }
  };

  return (
    <>
      <h2>Login</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <button onClick={handleSubmit}>Login</button>
    </>
  );
}

export default LoginPage;
