import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../../contexts/OnlineStatus';
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
const Notification = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const navigate = useNavigate();
  const socket = useSocket();
  const {lang} = useLang()
const {
  state: { darkMode },
} = useContext(ThemeContext);

  const bgColor = darkMode ? 'bg-white' : 'bg-gray-700';
   const textColor = darkMode ? 'text-black' : 'text-white';

  const request = async () => {
    try {
      const response = await axiosInstance.get('/connect/requests', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRequests(response.data?.viewRequest);
      console.log(response, 'reqqqqqqq');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    socket?.on('request-notification', ({ senderId }) => {
      setRequests((prevRequests) => prevRequests.filter((request) => request.sender.id !== senderId));
    });
  });
  const getRequest = () => {
    navigate('/requests');
  };
  useEffect(() => {
    request();
  }, []);

  return (
    <div
      className={`fixed lg:top-[7.5rem] xs:top-[6rem] rounded-lg right-2 lg:h-[50vh] xs:h-[45vh] shadow-lg w-96 xl:w-96 lg:w-72 xs:w-[31rem] lg:p-0 ${bgColor}  flex justify-center items-start `}
    >
      <div className="w-[30rem] flex flex-col justify-center items-center overflow-y-auto">
        <Label
          name="notification"
          className={`mt-6 text-xl ${textColor} font-poppins font-medium`}
          label={authLabel.notification[lang]}
        />
        {requests.length === 0 ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Label
              name="noNotification"
              className={`mt-6 text-xl ${textColor} font-poppins font-medium`}
              label={authLabel.noNotification[lang]}
            />{' '}
          </div>
        ) : (
          <div>
            {' '}
            {requests?.map((request) => (
              <div className="bg-blue-300 w-full h-16 rounded-lg items-center justify-start flex p-5 mb-2 gap-5">
                <div className=" ">
                  {request?.sender?.profile?.path ? (
                    <img
                      className="rounded-full w-20 h-14"
                      src={request.sender.profile.path}
                      alt=""
                    />
                  ) : (
                    <img className="rounded-full w-20 h-14" src="/profilenull.jpg" alt="" />
                  )}
                </div>
                <p className=" font-poppins font-bold" onClick={getRequest}>
                  {request.sender.details.first_name} {request.sender.details.last_name}{' '}
                  <span className="font-normal">wants to connect with you</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
