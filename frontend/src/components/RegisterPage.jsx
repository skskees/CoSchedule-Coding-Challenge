import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <- Add this
import api from '../api/api';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate(); // <- And this

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Logging in with:", {
      username: form.username.trim(),
      password: form.password
    });

    try {
      await api.post('/user/register', form);
      alert('Registration successful');

      // Redirect to login page
      navigate('/login'); // <- Replace login logic with redirect
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error registering user');
    }
  };

  return (
    <>
      <h2>Register</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <button onClick={handleSubmit}>Register</button>
    </>
  );
}

export default RegisterPage;
