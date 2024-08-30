import { useState } from 'react';
import {
  FaKey,
  FaUnlockAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaAdjust,
  FaLanguage,
} from 'react-icons/fa';
import UpdatePasswords from './UpdatePassword';
import EmailVerify from '../molecules/EmailVerify';
import OtpVerify from '../molecules/OtpVerify';

const Settings = () => {
  const [updatePass, setUpdatePass] = useState(false);
  const [resetpass, setResetPass] = useState(false);
  const [otpverifyPage, setOtpVerifyPage] = useState(false);

  const showUpdatePassword = () => {
    setUpdatePass(true);
    setResetPass(false);
    setOtpVerifyPage(false);
  };

  const showResetPage = () => {
    setResetPass(true);
    setOtpVerifyPage(false);
        setUpdatePass(false);

  };

  const showOtpverifyPage = () => {
    setOtpVerifyPage(true);
    setResetPass(false);
    setUpdatePass(false);
  };
  return (
    <div className="flex flex-col mt-20 2xl:ml-72 lg:ml-0 lg:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white p-4 lg:p-8 shadow-lg">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
        <ul className="space-y-4">
          <li
            className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200"
            onClick={showUpdatePassword}
          >
            <FaKey className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Update Password</span>
          </li>
          <li
            className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200"
            onClick={showResetPage}
          >
            <FaUnlockAlt className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Reset Password</span>
          </li>
          <li
            className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200"
            onClick={showOtpverifyPage}
          >
            <FaUserCircle className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Login Details</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <FaSignOutAlt className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Logout</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <FaAdjust className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Theme Toggle</span>
          </li>
          <li className="flex items-center cursor-pointer p-4 rounded-lg transition-all duration-200 hover:bg-gray-200">
            <FaLanguage className="text-gray-600 mr-4" size={20} />
            <span className="text-lg font-medium text-gray-800">Language Toggle</span>
          </li>
        </ul>
      </div>
      {updatePass && <UpdatePasswords />}
      {resetpass && <EmailVerify />}
    </div>
  );
};

export default Settings;
