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
        setVerify(true)
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
    <div className="flex-1 2xl:w-[76rem] h-screen bg-white p-4 lg:p-12 shadow-lg">
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!verify && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-6">
            <Label name="email" label={authLabel.email[lang]} />
            <InputField
              placeholder={authLabel.email[lang]}
              type="email"
              name="email"
              register={register}
              className="w-fit"
            />
          </div>
          <div className="flex justify-end mt-6">
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

      {verify && <OtpVerify email={email} />}
    </div>
  );
};



export default EmailVerify;
