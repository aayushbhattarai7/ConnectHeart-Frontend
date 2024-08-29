import Label from '../../common/atoms/Label';
import InputField from '../../common/atoms/InputField';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '../../common/atoms/Button';
import axiosInstance from '../../../service/instance';
import { useState } from 'react';
import axios from 'axios';
import PopupMessage from '../../common/atoms/PopupMessage';
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
    <div>
      {' '}
      <div className="flex-1 2xl:w-[76rem] h-screen  bg-white p-4 lg:p-12 shadow-lg">
        {success && <p className="text-green-500">{success}</p>}
        {error && <PopupMessage message={error} setMessage={setError} />}
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-800">Update Password</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="mb-4 w-fit">
              <Label name="password" label={authLabel.password[lang]} />
              <InputField
                placeholder={authLabel.enterYourPassword[lang]}
                type="password"
                name="oldPassword"
                register={register}
                className="w-fit"
              />
            </div>
            <div className="mb-4 w-fit">
              <Label name="password" label={authLabel.enterNewPassword[lang]} />
              <InputField
                placeholder={authLabel.enterNewPassword[lang]}
                type="password"
                name="password"
                register={register}
                className="w-fit"
              />
            </div>
            <div className="mb-4 w-fit">
              <Label name="password" label={authLabel.confirmPassword[lang]} />
              <InputField
                placeholder={authLabel.confirmPassword[lang]}
                type="password"
                name="confirmPassword"
                register={register}
                className="w-fit"
              />
            </div>
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
      </div>
    </div>
  );
};

export default UpdatePasswords;
