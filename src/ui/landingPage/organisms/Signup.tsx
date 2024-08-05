import React from 'react';
import InputField from "../../common/atoms/InputField";
import Button from "../../common/atoms/Button";
import Label from '../../common/atoms/Label'
import { useForm, SubmitHandler } from "react-hook-form";
import { useLang } from '../../../hooks/useLang';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '../molecules/LanguageToggle';
import { authLabel } from '../../../localization/auth';
import axiosInstance from '../../../service/instance';
interface FormData {
    first_name: string;
    middle_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    username: string;
    password: string;
}

const Signup: React.FC = () => {
    const navigate = useNavigate()
    const { lang } = useLang()



    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            console.log("Submitting data: ", data);
            const res = await axiosInstance.post('/user/signup', data);
            console.log("🚀 ~ constonSubmit:SubmitHandler<FormData>= ~ res:", res)

            navigate('/login')

        } catch (err) {
            console.error("🚀 ~ handleSubmit ~ err:", err);
        }
    };

    return (
        <div>
            <LanguageToggle />
            <Label name={'h1'} label={authLabel.signup[lang]}></Label>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Label name={'first_name'} label={authLabel.firstName[lang]}></Label>
                <InputField
                    placeholder={authLabel.firstName[lang]}
                    type="first_name"
                    name="first_name"
                    register={register}
                    className=''

                />

                <Label name={'middle_name'} label={authLabel.middleName[lang]}></Label>
                <InputField
                    placeholder={authLabel.middleName[lang]}
                    type="middle_name"
                    name="middle_name"
                    register={register}
                    className=''

                />

                <Label name={'last_name'} label={authLabel.lastName[lang]}></Label>
                <InputField 
                    placeholder={authLabel.lastName[lang]}
                    type="last_name"
                    name="last_name"
                    register={register}
                    className='border border-black'
                    

                />

                <Label name={'phone_number'} label={authLabel.phoneNumber[lang]}></Label>
                <InputField
                    placeholder={authLabel.phoneNumber[lang]}
                    type="phone_number"
                    name="phone_number"
                    register={register}
                    className=''

                />


                <Label name={'email'} label={authLabel.email[lang]}></Label>
                <InputField
                    placeholder={authLabel.enterYourEmail[lang]}
                    type="email"
                    name="email"
                    register={register}
                    className=''

                />

                <Label name={'username'} label={authLabel.userName[lang]}></Label>
                <InputField
                    placeholder={authLabel.userName[lang]}
                    type="username"
                    name="username"
                    register={register}
                    className=''

                />
                <Label name={'password'} label={authLabel.password[lang]}></Label>

                <InputField
                    placeholder={authLabel.enterYourPassword[lang]}
                    type="password"
                    name="password"
                    register={register}
                    className=''
                />
                <Button buttonText={authLabel.signup[lang]} name='' type="submit" disabled={isSubmitting} />
            </form></div>
    );
};

export default Signup;
