import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hook to enforce authentication on a page and return user info from localStorage.
// It mirrors the previous inline logic used in several pages.
export default function useRequireAuth() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState('');
  const [emailId, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('loggedInUser');
    if (!token) {
      navigate('/login');
    } else {
      setLoggedInUser(name || '');
      setEmail(localStorage.getItem('emailId') || '');
    }
  }, [navigate]);

  return { loggedInUser, emailId };
}
