import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '../organisms/Header';
import { Outlet, useNavigate } from 'react-router-dom';
export function Route() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('accessToken');
    useEffect(() => {
      if (!token) {
        navigate('/login');
      } else {
        try {
          const decoded = jwtDecode(token);
          if (!decoded) {
            navigate('/login');
          }
        } catch (error) {
          navigate('/login');
        }
      }
    }, [token, navigate]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
