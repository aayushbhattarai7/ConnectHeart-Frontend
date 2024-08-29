import React, { useEffect, useState } from 'react';
interface MessageProps {
  message: string | null;
  setMessage: (message: string | null) => void;
}
const PopupMessage: React.FC<MessageProps> = ({ message, setMessage }) => {
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
  return (
    <div className="fixed top-32 right-[53rem] bg-red-500 text-white p-4 rounded shadow-lg">
      {message}
   
    </div>
  );
};

export default PopupMessage;
