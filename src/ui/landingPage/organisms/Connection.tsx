import axios from 'axios';
import axiosInstance from '../../../service/instance';
import { useContext, useEffect, useState } from 'react';
import User from './User';
import { useNavigate } from 'react-router-dom';
import Label from '../../common/atoms/Label';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface Connection {
  id: string;
  email?: string;
  username?: string;
  details: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    gender:string
  };
  profile: {
    id?: string;
    path?: string;
  };
}

const Connection = () => {
  const [connects, setConnects] = useState<Connection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {lang} = useLang()
 const {
   state: { darkMode },
 } = useContext(ThemeContext);

  const bgColor = darkMode ? 'bg-gray-100' : 'bg-gray-800';
   const cardBgColor = darkMode ? 'bg-gray-100' : 'bg-gray-700';

 const textColor = darkMode ? 'text-black' : 'text-white';

  const showConnection = async () => {
    try {
      const response = await axiosInstance.get('/connect/friends', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setConnects(response?.data?.friends);
      console.log(response?.data?.friends);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching connection');
      } else {
        setError('Error while fetching connection');
      }
    }
  };

  const Remove = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/connect/remove/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setConnects((prevConnect) => prevConnect.filter((connect) => connect?.id !== id));
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while removing connection');
      } else {
        setError('Error while removing connection');
      }
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/userProfile/${userId}`);
  };

  useEffect(() => {
    showConnection();
  }, []);

  return (
    <div className={`p-4 sm:p-8  ${bgColor} h-screen overflow-y-auto flex flex-col`}>
      <div className=" ">
        <div className="justify-center items-center flex p-5"></div>
        <div className=" justify-start xs:ml-[2rem] h-auto pl-16 items-start">
          <div className="justify-start flex mx-auto flex-wrap gap-8 mb-10 overflow-hidden">
            {error && <p>{error}</p>}
            {connects.length === 0 ? (
              <div className="flex flex-col mt-14 items-center justify-center w-full">
                <div className="shadow-lg rounded-lg p-6 max-w-md text-center flex flex-col">
                  <div className="text-4xl text-gray-500 mb-4"></div>
                  <Label
                    name="requests"
                    className={`text-2xl font-semibold ${textColor}`}
                    label={authLabel.noConnection[lang]}
                  />
                  <Label
                    name="requests"
                    className={` ${textColor}`}
                    label={authLabel.noConnectionP[lang]}
                  />{' '}
                </div>
              </div>
            ) : (
              connects.map((connect) => (
                <div
                  key={connect.id}
                  className={`flex flex-col ml-56 mt-14 p-5  mb-5 justify-start items-center w-[15rem] ${textColor} ${cardBgColor} shadow-lg rounded-lg`}
                >
                  <div onClick={() => handleUserClick(connect.id)}>
                    <div className="h-44 w-44 mb-5 shadow-md">
                      {connect?.profile?.path ? (
                        <img className="rounded h-44 w-44" src={connect.profile.path} alt="" />
                      ) : (
                        <img className="rounded" src="/profilenull.jpg" alt="" />
                      )}
                    </div>
                    <div className="gap-2 mb-5 flex flex-col font-poppins font-medium">
                      <p>
                        {connect.details.first_name} {connect.details.last_name}
                      </p>
                      <p className="font-normal">{connect.details.gender}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => Remove(connect.id)}
                    className="mt-4 border border-blue-400 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-32 p-2 "
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 mt-10 ml-4"></div>

      <User />
    </div>
  );
};

export default Connection;
