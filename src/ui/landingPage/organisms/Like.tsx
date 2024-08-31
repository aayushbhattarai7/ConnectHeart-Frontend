import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

interface LikeProps {
  postId: string;
  userId: string;
  refresh: (postId: string) => void;
}

interface DecodedToken {
  id: string;
}

interface Like {
  id: string;
  auth: {
    id: string;
    email: string;
    details: {
      first_name: string;
    };
  };
}

const Like: React.FC<LikeProps> = ({ postId, refresh }) => {
  const [like, setLike] = useState<boolean>(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const toggleLike = async () => {
    try {
      await axiosInstance.post(`/like/${postId}`);
      refresh(postId);
      setLike((prev) => !prev);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    } else {
      console.error('No token found in sessionStorage');
    }
  }, []);

  const getLike = async (postId: string) => {
    try {
      const response = await axiosInstance.get(`/like/like/${postId}`);
      const likes = response.data.likes;

      const userLiked = likes.some((like: Like) => like.auth.id === decodedToken?.id);
      setLike(userLiked);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  useEffect(() => {
    if (decodedToken) {
      getLike(postId);
    }
  }, [postId, decodedToken]);

  return (
    <div>
      <button onClick={toggleLike} className="text-xl" style={{ color: like ? 'red' : 'black' }}>
        {like ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default Like;
