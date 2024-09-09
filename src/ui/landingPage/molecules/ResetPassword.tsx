import { useContext, useState } from 'react';
import Label from '../../common/atoms/Label';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import { useForm } from 'react-hook-form';
import Button from '../../common/atoms/Button';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import PopupMessage from '../../common/atoms/PopupMessage';
import { ThemeContext } from '../../../contexts/ThemeContext';

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
  const {
    state: { darkMode },
  } = useContext(ThemeContext);

  const bgColor = darkMode ? 'bg-gray-100' : 'bg-gray-900';
  const inputBg = darkMode ? 'bg-gray-200' : 'bg-gray-700';
    const cardBgColor = darkMode ? 'bg-gray-100' : 'bg-gray-900';


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
    <div className={`flex items-center justify-center  ${bgColor} p-4 lg:p-12`}>
      <div className={`w-full max-w-lg ${cardBgColor} p-6 rounded-lg`}>
        {error && <PopupMessage message={error} setMessage={setError} type="error" />}
        {success && <PopupMessage message={success} setMessage={setSuccess} type="success" />}
        {!verify && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-2 mb-6">
              <Label name="otp" label={authLabel.enterNewPassword[lang]} />
              <input
                {...register('password', { required: true })}
                placeholder={authLabel.enterNewPassword[lang]}
                type="password"
                className={`w-full p-2 ${inputBg} outline-none`}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label name="otp" label={authLabel.confirmPassword[lang]} />
              <input
                {...register('confirmPassword', { required: true })}
                placeholder={authLabel.confirmPassword[lang]}
                type="password"
                className={`w-full p-2 ${inputBg} outline-none`}
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
    </div>
  );
};

export default ResetPassword;
