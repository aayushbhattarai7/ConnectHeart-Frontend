import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaHeart, FaUserFriends, FaUser, FaUserClock } from 'react-icons/fa';
import { IoHomeSharp } from 'react-icons/io5';
import { AiFillMessage } from 'react-icons/ai';
import { IoMdFemale, IoMdMale, IoMdSettings } from 'react-icons/io';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { authLabel } from '../../../localization/auth';
import Label from '../../common/atoms/Label';
import { useLang } from '../../../hooks/useLang';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface User {
  id?: string;
  email?: string;
  details: {
    first_name: string;
    last_name: string;
    phone_number: string;
    gender: string;
  };
  profile: {
    id?: string;
    path?: string;
  };
}
interface Like {
  id?: string;
}

interface Count {
  counts?: string;
}

const SideBarDetails = () => {
  const [user, setUser] = useState<User | null>(null);
  const [count, setCount] = useState<Count | null>(null);
  const [like, setLike] = useState<Like[] | null>(null);
   const {
     state: { darkMode },
   } = useContext(ThemeContext);

  const bgColor = darkMode ? 'bg-white' : 'bg-gray-900';
  const textColor = darkMode ? 'text-black' : 'text-white';
  const activeText = darkMode ? 'text-black' : 'text-white'
  const activeBg = darkMode? 'bg-gray-300':'bg-gray-700'

  const location = useLocation();
  const { lang } = useLang();
  const isActive = (path: string) => location.pathname === path;

  const getUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/user/user', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response?.data?.getuser);
    } catch (error) {
      console.error(error);
    }
  };

  const getFriendCount = async () => {
    try {
      const response = await axiosInstance.get('/connect/count', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setCount(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserLike = async () => {
    try {
      const response = await axiosInstance.get('/like');
      setLike(response.data.likes);
      console.log(response.data.likes, 'likes');
    } catch (error) {}
  };

  useEffect(() => {
    getUserDetails();
    getFriendCount();
    getUserLike();
  }, [SideBarDetails]);

  return (
    <div>
      {location.pathname !== '/login' &&
        location.pathname !== '/signup' &&
        location.pathname !== '/message' && (
          <div
            className={`p-8 flex-col  fixed top-[6rem]  w-72 z-50 h-screen xs:h-auto ${bgColor} ${textColor}`}
          >
            <div key={user?.id} className="flex-col justify-center ml-4 flex mb-10 ">
              {user?.profile?.path ? (
                <Link to="/profile">
                  {' '}
                  <img
                    className="h-44 w-44 rounded-2xl mb-3"
                    src={user?.profile?.path}
                    alt="Profile"
                  />
                </Link>
              ) : (
                <Link to="/profile">
                  <img
                    className="h-44 w-44 rounded-2xl mb-3"
                    src="/profilenull.jpg"
                    alt="Default Profile"
                  />
                </Link>
              )}
              <div className="flex gap-1 ml-2 mb-2">
                <h1 className="text-xl">{user?.details?.first_name}</h1>
                <h1 className="text-xl">{user?.details?.last_name}</h1>
              </div>

              {user?.details?.gender === 'MALE' && (
                <p className="text-blue-700 text-2xl">
                  <IoMdMale />
                </p>
              )}
              {user?.details?.gender === 'FEMALE' && (
                <p className="text-pink-700 text-xl">
                  <IoMdFemale />
                </p>
              )}
            </div>

            <div className="flex gap-9 ml-8 mb-10">
              <Link to="/connect">
                {' '}
                <div className="w-fit flex flex-col items-center pr-9">
                  <h1 className={`${textColor}font-poppins font-medium`}>{count?.counts}</h1>
                  <h1 className="pr-1 text-blue-700 text-xl">
                    <FaUserFriends />
                  </h1>
                </div>
              </Link>
              <div className="w-fit flex flex-col items-center">
                <h1 className="font-medium font-poppins">{like?.length}</h1>
                <h1 className="pr-1 text-red-600">
                  <FaHeart />
                </h1>
              </div>
            </div>

            <div className={`flex flex-col gap-5 ${textColor}`}>
              <NavLink
                to={'/'}
                className={`group flex gap-3 h-14 justify-center items-center pr-7 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/') ? `rounded-lg w-[14rem] ${activeBg}` : ''}`}
              >
                <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.7rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                  <IoHomeSharp />
                </div>
                <Label
                  name="feed"
                  className={`text-xl group-hover:text-black font-medium font-poppins ${activeText}`}
                  label={authLabel.feed[lang]}
                />
              </NavLink>

              <NavLink
                to={'/connect'}
                className={`group flex gap-3 h-14 justify-center items-center pr-7 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/connect') ? `rounded-lg w-[14rem] ${activeBg}` : ''}`}
              >
                <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] group-hover:bg-gray-300 p-1 text-[1.8rem] group-hover:border-blue-300">
                  <FaUserFriends />
                </div>
                <Label
                  name="connection"
                  className={`text-xl group-hover:text-black font-medium font-poppins ${activeText}`}
                  label={authLabel.connection[lang]}
                />
              </NavLink>

              <NavLink
                to={'/requests'}
                className={`group flex gap-3 h-14 justify-center items-center pr-10 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/requests') ? `rounded-lg w-[14rem]  ${activeBg}` : ''}`}
              >
                <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.8rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                  <FaUserClock />
                </div>
                <Label
                  name="requests"
                  className={`text-xl group-hover:text-black font-medium font-poppins ${activeText}`}
                  label={authLabel.requests[lang]}
                />
              </NavLink>

              <NavLink
                to={'/message'}
                className={`group flex gap-3 h-14 justify-center items-center pr-10 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/message') ? `rounded-lg w-[14rem]  ${activeBg}` : ''}`}
              >
                <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.8rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                  <AiFillMessage />
                </div>
                <Label
                  name="message"
                  className={`text-xl group-hover:text-black font-medium font-poppins ${activeText}`}
                  label={authLabel.message[lang]}
                />
              </NavLink>

              <NavLink
                to={'/profile'}
                className={`group flex gap-3 h-14 justify-center items-center pr-16 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/profile') ? `rounded-lg w-[14rem]   ${activeBg}` : ''}`}
              >
                <div className=" flex items-center justify-center rounded-full w-[2.7rem] h-[2.7rem] text-[1.8rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                  <FaUser />
                </div>
                <Label
                  name="profile"
                  className={`text-xl group-hover:text-black font-medium font-poppins ${activeText}`}
                  label={authLabel.profile[lang]}
                />
              </NavLink>

              <div className="border  border-gray-300"></div>

              <NavLink
                to={'/settings'}
                className={`group flex gap-3 h-14 justify-center items-center pr-16 hover:border-blue-200 hover:bg-gray-200 hover:text-blue-600 hover:rounded-lg ${isActive('/settings') ? `rounded-lg w-[14rem]  ${activeBg}` : ''}`}
              >
                <div className=" flex items-center justify-center rounded-full w-[2.5rem] h-[2.5rem] text-[1.8rem] group-hover:bg-gray-300 group-hover:border-blue-300">
                  <IoMdSettings />
                </div>
                <Label
                  name="settings"
                  className={`text-xl group-hover:text-black font-medium font-poppins ${activeText}`}
                  label={authLabel.settings[lang]}
                />
              </NavLink>
            </div>
            <div></div>
          </div>
        )}
    </div>
  );
};

export default SideBarDetails;
