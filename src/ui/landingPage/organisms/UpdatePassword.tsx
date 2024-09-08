import Label from '../../common/atoms/Label';
import InputField from '../../common/atoms/InputField';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '../../common/atoms/Button';
import axiosInstance from '../../../service/instance';
import { useContext, useState } from 'react';
import axios from 'axios';
import PopupMessage from '../../common/atoms/PopupMessage';
import { ThemeContext } from '../../../contexts/ThemeContext';
interface FormData {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}
const UpdatePasswords = () => {
  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
 const {
   state: { darkMode },
 } = useContext(ThemeContext);

 const bgColor = darkMode ? 'bg-gray-100' : 'bg-gray-800';
 const hoverBgColor = darkMode ? 'hover:bg-gray-300' : 'hover:bg-gray-900';
 const textColor = darkMode ? 'text-black' : 'text-white';
  const onSubmit: SubmitHandler<FormData> = async (data, e) => {
    try {
      const res = await axiosInstance.patch('user/updatePassword', data);
      e?.preventDefault();
      setSuccess(res?.data?.message);
      setError('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred');
        setSuccess('');
      } else {
        setError('Email or password is incorrect');
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-32 h-[70vh] ml-60">
      {' '}
      <div
        className={`flex 2xl:ml-40 2xl:w-[30rem] justify-center ${bgColor} p-4 lg:p-12 shadow-lg`}
      >
        {success && <PopupMessage message={success} setMessage={setSuccess} type="success" />}
        {error && <PopupMessage message={error} setMessage={setError} type="error" />}
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <h1 className={`text-3xl font-bold ${textColor} mb-4 text-center`}>
            Update Your Password
          </h1>
          <p className={`text-lg ${textColor} mb-6 text-center`}>
            Enter your new password below to update your account credentials. Make sure to choose a
            strong and secure password.
          </p>
          <div className="flex flex-col pl-20 justify-center gap-6">
            <div className="mb-4 w-fit">
              <Label className={`${textColor}`} name="password" label={authLabel.password[lang]} />
              <InputField
                placeholder={authLabel.enterYourPassword[lang]}
                type="password"
                name="oldPassword"
                register={register}
                className={`w-fit ${textColor}`}
              />
            </div>
            <div className="mb-4 w-fit">
              <Label
                className={`${textColor}`}
                name="password"
                label={authLabel.enterNewPassword[lang]}
              />
              <InputField
                placeholder={authLabel.enterNewPassword[lang]}
                type="password"
                name="password"
                register={register}
                className="w-fit"
              />
            </div>
            <div className="mb-4 w-fit">
              <Label
                className={`${textColor}`}
                name="password"
                label={authLabel.confirmPassword[lang]}
              />
              <InputField
                placeholder={authLabel.confirmPassword[lang]}
                type="password"
                name="confirmPassword"
                register={register}
                className="w-fit"
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Button
              buttonText={authLabel.updatePassword[lang]}
              type="submit"
              name=""
              disabled={isSubmitting}
              className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswords;
