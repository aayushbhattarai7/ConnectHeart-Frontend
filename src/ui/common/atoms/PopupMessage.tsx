import React, { useEffect, useState } from 'react';
interface MessageProps {
  message: string | null;
  setMessage: (message: string | null) => void;
  type: 'success' | 'error';
}
const PopupMessage: React.FC<MessageProps> = ({ message, setMessage, type }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    setIsVisible(true);

    const popupTime = setTimeout(() => {
      setIsVisible(false);
      setMessage(null);
    }, 3000);

    return () => {
      clearTimeout(popupTime);
    };
  }, [message]);

 
  if (!isVisible) {
    message === null;
    return null;
  }
  const bgColor = type === 'success'? 'bg-green-500':'bg-red-500'
  return (
    <div className={`fixed top-32 right-[53rem] ${bgColor} text-white p-4 rounded shadow-lg`}>
      {message}
    </div>
  );
};

export default PopupMessage;
