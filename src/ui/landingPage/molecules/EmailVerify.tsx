import { useState } from 'react';
import InputField from '../../common/atoms/InputField';
import Label from '../../common/atoms/Label';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '../../common/atoms/Button';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import OtpVerify from './OtpVerify';

// Define the FormData type
interface FormData {
  email: string;
}

const EmailVerify = () => {
  const { lang } = useLang();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [verify, setVerify] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await axiosInstance.patch('user/verify', data);
      setSuccess(res?.data?.message);
      setError('');
      setEmail(data.email);
      setVerify(true);
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
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4 lg:p-12">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!verify && (
          <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Forgot Your Password?
              </h1>
              <p className="text-lg text-gray-600 mb-6 text-center">
                No worries! Enter your email address below and we'll send you a OTP to reset your
                password.
              </p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Label name="email" label={authLabel.email[lang]} />
                <InputField
                  placeholder={authLabel.email[lang]}
                  type="email"
                  name="email"
                  register={register}
                  className="w-full"
                />
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  buttonText={authLabel.verify[lang]}
                  type="submit"
                  name=""
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </div>
        )}

        {verify && <OtpVerify email={email} />}
      </div>
    </div>
  );
};

export default EmailVerify;
