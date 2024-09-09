import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { FaImage, FaSmile, FaVideo } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useLang } from '../../../hooks/useLang';
import axiosInstance from '../../../service/instance';
import Button from '../../common/atoms/Button';
import { authLabel } from '../../../localization/auth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PopupMessage from '../../common/atoms/PopupMessage';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface FormData {
  thought: string;
  feeling: string;
  files: File[];
}

interface PostProps {
  postId: string;
  refresh: (postId: string) => void;
}

interface User {
  id?: string;
  email?: string;
  details: {
    first_name: string;
    last_name: string;
    phone_number: string;
    gender: string;
  };
  profile: {
    id?: string;
    path?: string;
  };
}

const Post: React.FC<PostProps> = ({ postId, refresh }) => {
  const { lang } = useLang();
  const {
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();
 const {
   state: { darkMode },
 } = useContext(ThemeContext);

 const bgColor = darkMode ? 'bg-white' : 'bg-gray-900';

  const [user, setUser] = useState<User | null>(null);
  const [formData, setformData] = useState<FormData>({ thought: '', feeling: '', files: [] });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/user/user', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response?.data?.getuser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData();
      data.append('thought', formData.thought);
      data.append('feeling', formData.feeling);
      data.append('type', 'POST');
      formData.files?.forEach((file) => data.append('files', file));
      const res = await axiosInstance.post('/post', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reset();
      refresh(postId);
      setformData({ thought: '', feeling: '', files: [] });
      setImagePreviews([]);
      setSuccess(res?.data?.message);
    } catch (err) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred');
        setSuccess('');
      } else {
        setError('Post should not be empty');
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setformData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setformData((prevData) => ({
      ...prevData,
      files,
    }));

    setImagePreviews(files.map(URL.createObjectURL));
  };

  useEffect(() => {
    getUserDetails();
  });

  return (
    <div className={`2xl:w-[50rem] xl:w-[48rem]  lg:w-[40rem] md:w-[40rem] sm:w-[30rem] mb-10 mt-20 ${bgColor} rounded-lg shadow-md p-6`}>
      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        <div className="flex gap-6 items-start mb-6" key={user?.id}>
          {user?.profile?.path ? (
            <Link to="/profile">
              {' '}
              <img className="w-16 h-16 rounded-full" src={user?.profile?.path} alt="Profile" />
            </Link>
          ) : (
            <Link to="/profile">
              <img
                className="w-16 h-16 rounded-full"
                src="/profilenull.jpg"
                alt="Default Profile"
              />
            </Link>
          )}
          <div className="flex flex-col flex-1  gap-4 ">
            <input
              placeholder={authLabel.whatsOnMind[lang] || "What's on your mind?"}
              name="thought"
              onChange={handleChange}
              className={`w-full p-3 border ${bgColor} border-gray-600 rounded-2xl focus:outline-none resize-none`}
            />
            <div className="flex items-center justify-between">
              <Button
                buttonText={authLabel.post[lang]}
                name=""
                type="submit"
                disabled={isSubmitting}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-around  mt-2 border-t border-gray-300 pt-2">
          {error && <PopupMessage message={error} setMessage={setError} type="error" />}
          {success && <PopupMessage message={success} setMessage={setSuccess} type="success" />}

          <div className="flex gap-20 font-poppins font-medium">
            <label className="cursor-pointer flex items-center gap-1 text-green-500">
              <FaImage className="text-2xl" />
              <input
                type="file"
                name="files"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-sm ">{authLabel.media[lang]}</span>
            </label>
            <button type="button" className="flex items-center gap-1 text-yellow-500">
              <FaSmile className="text-xl" />
              <select
                id="feeling"
                {...register('feeling')}
                onChange={handleChange}
                className={`rounded-md  w-24 py-2  focus:outline-none ${bgColor} text-yellow-500`}
              >
                <option value=""> {authLabel.feeling[lang]}</option>
                <option value="Happy">😊 Happy</option>
                <option value="Loved">❤️ Loved</option>
                <option value="Flirty">😉 Flirty</option>
                <option value="Curious">🤔 Curious</option>
                <option value="Grateful">🙏 Grateful</option>
                <option value="In Love">😍 In Love</option>
                <option value="Playful">😜 Playful</option>
                <option value="Anxious">😰 Anxious</option>
                <option value="Romantic">💘 Romantic</option>
                <option value="Cheerful">😁 Cheerful</option>
              </select>
            </button>

            <button type="button" className="flex items-center gap-1 text-green-500">
              <FaVideo className="text-xl" />
              <span className="text-sm">{authLabel.live[lang]}</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {imagePreviews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="Selected"
              className="w-20 h-20 rounded-md object-cover"
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default Post;
