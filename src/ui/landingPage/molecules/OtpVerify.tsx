import { useContext, useState } from 'react';
import Label from '../../common/atoms/Label';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import { useForm } from 'react-hook-form';
import Button from '../../common/atoms/Button';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import PopupMessage from '../../common/atoms/PopupMessage';
import ResetPassword from './ResetPassword';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface FormData {
  email: string;
  otp: string; 
}

interface OtpVerifyProps {
  email: string;
}

const OtpVerify: React.FC<OtpVerifyProps> = ({ email }) => {
  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verify, setVerify] = useState(false);
const {
  state: { darkMode },
} = useContext(ThemeContext);

const bgColor = darkMode ? 'bg-gray-100' : 'bg-gray-900';
const inputBg = darkMode ? 'bg-gray-200' : 'bg-gray-700';
  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', data.otp);
      console.log(email, data.otp, 'hashahha');

      const res = await axiosInstance.post('user/verifyOTP', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccess(res?.data?.message);
      setError('');
      setVerify(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred');
        setSuccess('');
      } else {
        setError('Email or OTP is incorrect');
      }
    }
  };

  return (
      <div className={`w-[30rem] p-6 rounded-lg ${bgColor} `}>
        {error && <PopupMessage message={error} setMessage={setError} type="error" />}
        {success && <PopupMessage message={success} setMessage={setSuccess} type="success" />}

        {!verify && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Label name="otp" label={authLabel.EnterOTP[lang]} />
              <input
                {...register('otp', { required: true })}
                placeholder={authLabel.EnterOTP[lang]}
                type="number"
                className={`w-full p-2  ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                buttonText={authLabel.verify[lang]}
                type="submit"
                name=""
                disabled={isSubmitting}
                className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        )}

        {verify && <ResetPassword email={email} />}
      </div>
  );
};

export default OtpVerify;
