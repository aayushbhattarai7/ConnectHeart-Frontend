import React from 'react';
import InputField from "../../common/atoms/InputField";
import Button from "../../common/atoms/Button";
import Label from '../../common/atoms/Label'
import { useForm, SubmitHandler } from "react-hook-form";
import { useLang } from '../../../hooks/useLang';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '../molecules/LanguageToggle';
import { authLabel } from '../../../localization/auth';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { lang } = useLang()



  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log("Submitting data: ", data);
      const response = await axiosInstance.post('/user/login', data, {
        headers: {
          'Content-Type':'application/json'
        }
      });
      const token = response?.data?.data?.tokens?.accessToken
      if(token) {
        sessionStorage.setItem('accessToken', token);
      }
      navigate('/')
      
    } catch (error) {
      if(axios.isAxiosError(error)) {
        console.error("🚀 ~ handleSubmit ~ err:", error);

      }
    }
  };

  return (
    <div>
      <LanguageToggle />
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Label name={'email'} label={authLabel.email[lang]} required></Label>
        <InputField
          placeholder={authLabel.enterYourEmail[lang]}
          type="email"
          name="email"
          register={register}

        />
        <InputField
          placeholder={authLabel.enterYourPassword[lang]}
          type="password"
          name="password"
          register={register}
        />
        <Button buttonText={authLabel.login[lang]} name='' type="submit" disabled={isSubmitting} />
      </form></div>
  );
};

export default Login;
