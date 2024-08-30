import { useState } from 'react';
import Label from '../../common/atoms/Label';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import { useForm } from 'react-hook-form';
import Button from '../../common/atoms/Button';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import PopupMessage from '../../common/atoms/PopupMessage';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface EmailProps {
  email: string;
}

const ResetPassword: React.FC<EmailProps> = ({ email }) => {
  const { lang } = useLang();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verify, setVerify] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      console.log(email, data.password, 'hashahha');

      const res = await axiosInstance.patch('user/resetPassword', formData, {
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
        setError('Invalid Input');
      }
    }
  };

  return (
    <div className="flex-1 2xl:w-[76rem] h-screen bg-white p-4 lg:p-12 shadow-lg">
      {error && <PopupMessage message={error} setMessage={setError} type="error" />}
      {success && <PopupMessage message={success} setMessage={setSuccess} type="success" />}
      {!verify && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6">
            <Label name="otp" label={authLabel.enterNewPassword[lang]} />
            <input
              {...register('password', { required: true })}
              placeholder={authLabel.enterNewPassword[lang]}
              type="password"
              className="w-fit"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Label name="otp" label={authLabel.confirmPassword[lang]} />
            <input
              {...register('confirmPassword', { required: true })}
              placeholder={authLabel.confirmPassword[lang]}
              type="password"
              className="w-fit"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              buttonText={authLabel.updatePassword[lang]}
              type="submit"
              name=""
              disabled={isSubmitting}
              className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
