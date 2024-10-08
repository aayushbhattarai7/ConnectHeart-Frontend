import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { FaHeartCirclePlus, FaHeartCircleXmark } from 'react-icons/fa6';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Label from '../../common/atoms/Label';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface Request {
  id: string;
  sender: {
    id: string;
    email?: string;
    username?: string;
    details: {
      first_name?: string;
      middle_name?: string;
      last_name?: string;
      gender?: string;
    };
    profile: {
      id?: string;
      path?: string;
    };
  };
}

const Request = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { lang } = useLang()
   const {
     state: { darkMode },
   } = useContext(ThemeContext);

  const bgColor = darkMode ? 'bg-gray-100' : 'bg-gray-800';
   const textColor = darkMode ? 'text-black' : 'text-white';
  const showRequest = async () => {
    try {
      const response = await axiosInstance.get('/connect/requests', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRequests(response.data?.viewRequest);
      console.log(response?.data.viewRequest, 'hajahah');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching post');
      }
    }
  };

  const AcceptRequest = async (id: string) => {
    try {
      const response = await axiosInstance.patch(`/connect/accept/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRequests((prevRequests) => prevRequests.filter((request) => request.sender.id !== id));
      console.log(response, 'hojeuuh');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching post');
      }
    }
  };

  const Reject = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/connect/reject/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRequests((prevRequests) => prevRequests.filter((request) => request.sender.id !== id));
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching post');
      }
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/userProfile/${userId}`);
  };

  useEffect(() => {
    showRequest();
  }, []);
  return (
    <div className={`h-screen mt-20 justify-start flex flex-col  items-start xs:pl-20 ${bgColor}`}>
      <div className=" flex flex-wrap">
        {error && <p>{error}</p>}
        {requests.length === 0 ? (
          <div className="flex flex-col 2xl:ml-[55rem] mt-32 items-center justify-center w-full h-[40rem]">
            <div className=" shadow-lg rounded-lg p-6 max-w-md text-center flex flex-col">
              <Label
                name="requests"
                className={`text-2xl font-semibold ${textColor}`}
                label={authLabel.noRequest[lang]}
              />
                <Label
                  name="requests"
                  className={`${textColor} mt-2`}
                  label={authLabel.noRequestP[lang]}
                />{' '}
            </div>
          </div>
        ) : (
          requests.map((request) => (
            <div className="mb-7 pl-5 ml-56 mt-16 flex flex-col justify-start items-start ">
              <div
                key={request.id}
                className="flex flex-col p-5 justify-center  bg-white shadow-lg rounded-lg"
              >
                <div onClick={() => handleUserClick(request.sender.id)}>
                  <div className="mb-5 shadow-lg">
                    {request?.sender?.profile?.path ? (
                      <img
                        className="h-44 w-44  rounded"
                        src={request.sender.profile.path}
                        alt=""
                      />
                    ) : (
                      <img className="h-44 w-44  rounded" src="/profilenull.jpg" alt="" />
                    )}
                  </div>
                  <div className="gap-2 mb-5 flex flex-col font-poppins font-medium">
                    <p>
                      {request.sender.details.first_name} {request.sender.details.last_name}
                    </p>
                    <p>{request.sender.details.gender}</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <button
                    onClick={() => AcceptRequest(request.sender.id)}
                    className="border border-blue-400 bg-blue-600 text-white rounded-lg w-20 p-2 pl-8"
                    type="button"
                  >
                    <FaHeartCirclePlus />
                  </button>
                  <button
                    onClick={() => Reject(request.sender.id)}
                    className="border border-red-400 bg-red-600 text-white rounded-lg w-20 pl-8"
                    type="button"
                  >
                    <FaHeartCircleXmark />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Request;
