import React, { useContext, useState } from 'react';
import InputField from '../../common/atoms/InputField';
import Button from '../../common/atoms/Button';
import Label from '../../common/atoms/Label';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLang } from '../../../hooks/useLang';
import { Link, useNavigate } from 'react-router-dom';
import { authLabel } from '../../../localization/auth';
import axiosInstance from '../../../service/instance';
import { MdOutlineArrowOutward } from 'react-icons/md';
import axios from 'axios';
import PopupMessage from '../../common/atoms/PopupMessage';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface FormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  username?: string;
  password: string;
  profile: FileList;
  gender: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
   const {
     state: { darkMode },
   } = useContext(ThemeContext);

   const bgColor = darkMode ? 'bg-white' : 'bg-gray-900';
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('phone_number', data.phone_number);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('gender', data.gender);
      formData.append('type', 'PROFILE');
      if (data.profile.length > 0) {
        formData.append('profile', data.profile[0]);
      }

      const response = await axiosInstance.post('/user/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setError(null);
      setSuccess(response?.data?.message)
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred');
      } else {
        setError('Required fields should not be empty');
      }
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen  font-poppins px-4 ${bgColor}`}>
      <div
        className={
          darkMode
            ? 'bg-white p-6 mt-20 rounded-lg shadow-lg w-full max-w-lg'
            : 'bg-gray-800 p-6 mt-20 rounded-lg text-white shadow-md w-full max-w-lg'
        }
      >
        <h1 className="text-2xl font-semibold mb-4">Signup</h1>
        <p className="mb-6">Hi, Welcome to ConnectHeart👋</p>
        {success && <PopupMessage message={success} setMessage={setSuccess} type="success" />}
        {error && <PopupMessage message={error} setMessage={setError} type="error" />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
          <div className="mb-4">
            <Label name="first_name" label={authLabel.firstName[lang]} required />
            <InputField
              placeholder={authLabel.firstName[lang]}
              type="text"
              name="first_name"
              register={register}
              className={
                darkMode
                  ? 'w-full bg-white text-black border-gray-200'
                  : 'w-full bg-gray-900 text-white border-gray-500'
              }
            />
          </div>

          <div className="mb-4">
            <Label name="last_name" label={authLabel.lastName[lang]} required />
            <InputField
              placeholder={authLabel.lastName[lang]}
              type="text"
              name="last_name"
              register={register}
              className={
                darkMode
                  ? 'w-full bg-white text-black border-gray-200'
                  : 'w-full bg-gray-900 text-white border-gray-500'
              }
            />
          </div>

          <div className="mb-4">
            <Label name="phone_number" label={authLabel.phoneNumber[lang]} />
            <InputField
              placeholder={authLabel.phoneNumber[lang]}
              type="text"
              name="phone_number"
              register={register}
              className={
                darkMode
                  ? 'w-full bg-white text-black border-gray-200'
                  : 'w-full bg-gray-900 text-white border-gray-500'
              }
            />
          </div>

          <div className="mb-4">
            <Label name="gender" label={authLabel.gender[lang]} required />
            <select
              className={
                darkMode
                  ? 'w-full border border-white rounded-lg p-2'
                  : 'w-full border border-gray-500 bg-gray-900 rounded-lg p-2'
              }
              {...register('gender', { required: true })}
            >
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="mb-4">
            <Label name="email" label={authLabel.email[lang]} required />
            <InputField
              placeholder={authLabel.enterYourEmail[lang]}
              type="email"
              name="email"
              register={register}
              className={
                darkMode
                  ? 'w-full bg-white text-black border-gray-200'
                  : 'w-full bg-gray-900 text-white border-gray-500'
              }
            />
          </div>

          <div className="mb-4">
            <Label name="password" label={authLabel.password[lang]} required />
            <InputField
              placeholder={authLabel.enterYourPassword[lang]}
              type="password"
              name="password"
              register={register}
              className={
                darkMode
                  ? 'w-full bg-white text-black border-gray-200'
                  : 'w-full bg-gray-900 text-white border-gray-500'
              }
            />
          </div>

          <div className="mb-4">
            <Label name="profile" label={authLabel.profile[lang]} />
            <input
              type="file"
              {...register('profile')}
              className={
                darkMode
                  ? 'w-full border bg-white rounded-lg p-2'
                  : 'w-full border bg-gray-900 border-gray-500 rounded-lg p-2'
              }
            />
          </div>

          <Button
            buttonText={authLabel.signup[lang]}
            name=""
            type="submit"
            disabled={isSubmitting}
            className="w-full mb-4 bg-blue-500 text-white hover:bg-blue-700"
          />

          <div className="text-center">
            <Link className="text-blue-800 flex justify-center items-center" to="/login">
              Already registered?
              <MdOutlineArrowOutward className="ml-1" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
