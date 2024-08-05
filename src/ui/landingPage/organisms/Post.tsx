import React, { FormEvent, useState } from 'react';
import InputField from "../../common/atoms/InputField";
import Button from "../../common/atoms/Button";
import Label from '../../common/atoms/Label'
import { useLang } from '../../../hooks/useLang';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '../molecules/LanguageToggle';
import { authLabel } from '../../../localization/auth';
import axiosInstance from '../../../service/instance';
interface FormData {
    thought: string;
    feeling: string;
    files: File[]
}

const Post: React.FC = () => {
    const navigate = useNavigate()
    const { lang } = useLang()

    const { register, formState: { isSubmitting } } = useForm<FormData>();
    const [formData, setformData] = useState<FormData>({
        thought: '',
        feeling: '',
        files: []
    });


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const data = new FormData();
            data.append('thought', formData.thought);
            data.append('feeling', formData.feeling);
            data.append('type', 'POST')
            formData.files?.forEach((file) => {
                data.append('files', file)
            })
            console.log("Submitting data: ", data);
            const res = await axiosInstance.post('/post', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/')
            console.log("Response data: ", res.data);
        } catch (err) {
            console.error("🚀 ~ handleSubmit ~ err:", err);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setformData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setformData((prevData) => ({
            ...prevData,
            files: Array.from(e.target.files || [])
        }));
    }


    return (
        <div>
            <LanguageToggle />
            <Label name='post' label={authLabel.post[lang]}></Label>

            <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                <Label name={'thought'} label={authLabel.thought[lang]} required></Label>
                <InputField
                    placeholder={authLabel.thought[lang]}
                    type="thought"
                    name="thought"
                    register={register}
                    onChange={handleChange}


                />

                <Label name={'feeling'} label={authLabel.feeling[lang]} required></Label>

                <InputField
                    placeholder={authLabel.feeling[lang]}
                    type="feeling"
                    name="feeling"
                    register={register}
                    onChange={handleChange}
                />

                <Label name={'files'} label={authLabel.media[lang]}></Label>
                <input type="file" name='files' multiple onChange={handleFileChange} />

                <Button buttonText={authLabel.post[lang]} name='' type="submit" disabled={isSubmitting} />
            </form></div>
    );
};

export default Post;
