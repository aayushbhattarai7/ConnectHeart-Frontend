import { useState } from 'react';
import { FaKey, FaUnlockAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { BsHouseLockFill } from 'react-icons/bs';
import UpdatePasswords from './UpdatePassword';
import EmailVerify from '../molecules/EmailVerify';
import { useNavigate } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';
import axiosInstance from '../../../service/instance';

const Settings = () => {
  const [updatePass, setUpdatePass] = useState(false);
  const [resetpass, setResetPass] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [isDelete, setIsDelete] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const navigate = useNavigate();
  const handleMenuClick = (item: any) => {
    setActiveItem(item);
    if (item === 'updatePass') {
      setUpdatePass(true);
      setResetPass(false);
    } else if (item === 'resetPass') {
      setResetPass(true);
      setUpdatePass(false);
    } else if (item === 'otpVerify') {
      setResetPass(false);
      setUpdatePass(false);
    }
  };

  const isActive = (item: any) => activeItem === item;

  const Logout = () => {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setIsLogout(true);
  };

  const handleCloseLogout = () => {
    setIsLogout(false);
  };

  const handleDeleteClick = () => {
    setIsDelete(true)
    console.log('clicked')
  };
   const handleDelete = async () => {
     try {
       const response = await axiosInstance.patch(`/user/delete`);
       console.log(response);
       navigate('/login')
     } catch (error) {}
   };
   const handleCloseDelete = () => {
     setIsDelete(false);
   };

  return (
    <div className="flex flex-col mt-20 2xl:ml-72 lg:ml-0 lg:flex-row bg-gray-100 min-h-[90vh]">
      <div className="w-full lg:w-1/4 bg-white p-4 lg:p-8 shadow-lg">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
        <ul className="space-y-4">
          <li
            className={`flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 ${isActive('updatePass') ? 'bg-gray-100' : 'hover:bg-gray-200'}`}
            onClick={() => handleMenuClick('updatePass')}
          >
            <FaKey className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Update Password</span>
          </li>
          <li
            className={`flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 ${isActive('resetPass') ? 'bg-gray-100' : 'hover:bg-gray-200'}`}
            onClick={() => handleMenuClick('resetPass')}
          >
            <FaUnlockAlt className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Reset Password</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <BsHouseLockFill className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Privacy</span>
          </li>
          <li
            className={`flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 ${isActive('otpVerify') ? 'bg-gray-100' : 'hover:bg-gray-200'}`}
            onClick={() => handleMenuClick('otpVerify')}
          >
            <FaUserCircle className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Login Details</span>
          </li>
          <li
            className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200"
            onClick={handleLogoutClick}
          >
            <FaSignOutAlt className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Logout</span>
          </li>

          <li
            className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200"
            onClick={handleDeleteClick}
          >
            <FaSignOutAlt className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Delete Account</span>
          </li>
        </ul>
      </div>
      {updatePass && <UpdatePasswords />}
      <div className="xl:ml-96"> {resetpass && <EmailVerify />}</div>
      {isLogout && (
        <div className="fixed inset-0 flex items-center justify-center font-poppins bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Logout</h2>
              <button onClick={handleCloseLogout} className="text-gray-500">
                <RxCross2 />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to Logout?</p>
            <div className="flex justify-end gap-4">
              <button
                name="Cancel"
                type="button"
                onClick={handleCloseLogout}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                name="Confirm"
                type="button"
                onClick={Logout}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        {isDelete && (
          <div>
            <div className="fixed inset-0 w-[100%] flex items-center justify-center font-poppins bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Delete Account</h2>
                  <button onClick={handleCloseDelete} className="text-gray-500">
                    <RxCross2 />
                  </button>
                </div>
                <p className="mb-4">
                  {' '}
                  Are you sure you want to delete your account? Please note that your account will
                  be permanently deleted only after 10 days from the start of the deletion process.
                  During this period, you can cancel the deletion if you change your mind.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    name="Cancel"
                    type="button"
                    onClick={handleCloseDelete}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    name="Confirm"
                    type="button"
                    onClick={handleDelete}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
