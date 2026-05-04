import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/authActions';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (username.length < 4 || password.length < 4) {
      setValidationError('Username and password must be at least 4 characters long.');
      return;
    }

    const userData = {
      username,
      email: email.toLowerCase(),
      password,
    };

    const result = await dispatch(registerUser(userData));

    if (result.success) {
      navigate('/');
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 bg-[#fdf6e3] dark:bg-[#282a36] dark:text-[#f8f8f2] rounded-lg shadow-md border border-[#eee8d5] dark:border-[#44475a]">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#268bd2] dark:text-[#bd93f9] text-center">Register</h2>

      {(error || validationError) && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-[#ffb86c]/20 text-[#dc322f] dark:bg-[#ff5555]/20 dark:text-[#ffb86c] rounded text-sm sm:text-base">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 sm:mb-4">
          <label className="block text-[#073642] dark:text-[#bd93f9] mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 text-sm sm:text-base border border-[#b58900] dark:border-[#6272a4] rounded focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent dark:bg-[#21222c] dark:text-[#f8f8f2] text-[#073642] bg-[#fdf6e3]"
            required
            minLength="4"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <label className="block text-[#073642] dark:text-[#bd93f9] mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 text-sm sm:text-base border border-[#b58900] dark:border-[#6272a4] rounded focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent dark:bg-[#21222c] dark:text-[#f8f8f2] text-[#073642] bg-[#fdf6e3]"
            required
          />
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-[#073642] dark:text-[#bd93f9] mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-sm sm:text-base border border-[#b58900] dark:border-[#6272a4] rounded focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent dark:bg-[#21222c] dark:text-[#f8f8f2] text-[#073642] bg-[#fdf6e3]"
            required
            minLength="4"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#268bd2] hover:bg-[#2aa198] dark:bg-[#bd93f9] dark:hover:bg-[#ff79c6] text-white py-2 px-4 rounded font-medium transition-colors disabled:bg-[#b58900] text-sm sm:text-base"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
