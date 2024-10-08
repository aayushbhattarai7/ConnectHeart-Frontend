import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface Connection {
  id: string;
  email?: string;
  username?: string;
  details: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
  };
  profile?: {
    id?: string;
    path?: string;
  };
}

const User = () => {
  const [users, setUsers] = useState<Connection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null)
  const navigate = useNavigate();
 const {
   state: { darkMode },
 } = useContext(ThemeContext);

 const bgColor = darkMode ? 'bg-gray-100' : 'bg-gray-800';
  const textColor = darkMode ? 'text-black' : 'text-white';
     const cardBgColor = darkMode ? 'bg-gray-100 hover:bg-gray-50' : 'bg-gray-900 hover:bg-gray-700';


  const showUsers = async () => {
    try {
      const response = await axiosInstance.get('/connect/suggestion', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUsers(response?.data?.user);
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching users');
      } else {
        setError('Error while fetching users');
      }
    }
  };

  const sendRequest = async (id: string) => {
    try {
      const response = await axiosInstance.post(`/connect/${id}`);
      setUsers((prevRequests) => prevRequests.filter((user) => user.id !== id));
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while sending request');
      } else {
        setError('Error while sending request');
      }
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/userProfile/${userId}`);

    setUser((prevId) => (prevId))
  };

  useEffect(() => {
    showUsers();
  }, []);

  return (
    <div className={` ${bgColor} ${textColor} flex flex-col items-center  mt-4 mx-auto overflow-y-auto lg:w-[40rem] xs:w-[30rem] `}>
      <div className="flex justify-center mb-4 2xl:ml-[20rem">
        <h1 className="text-xl  font-poppins font-medium">People You May Know</h1>
      </div>
      <div className={`w-full shadow-md rounded-lg overflow-hidden 2xl:w-[40rem] xl:w-[32rem] ${cardBgColor} lg:w-[27rem] md:w-[30rem] sm:w-[40rem] `}>
        {error && <p className="text-red-500 p-4">{error}</p>}
        <ul className="divide-y divide-gray-200">
          {users?.map((user) => (
            <li
              key={user?.id}
              className="flex flex-col sm:flex-row items-center xs:gap-2 lg:justify-between p-2 "
            >
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                {user?.profile?.path ? (
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={user?.profile?.path}
                    alt="Profile"
                  />
                ) : (
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src="/profilenull.jpg"
                    alt="Default Profile"
                  />
                )}
            <div className="text-center sm:text-left mt-2 sm:mt-0">
                  <p className="font-semibold text-lg ">
                    {user?.details?.first_name} {user?.details?.last_name}
                  </p>
                  {user?.email && <p className=" text-sm">{user?.email}</p>}
                </div>
              </div>
              <button
                className="mt-0 sm:mt-0 w-32 px-4 h-12 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                onClick={() => sendRequest(user?.id)}
              >
                Send
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default User;
