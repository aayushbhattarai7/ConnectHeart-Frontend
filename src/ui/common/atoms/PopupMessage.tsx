import React, { useEffect, useState } from 'react';

const PopupMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const popupTime = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(popupTime);
  }, [message]);

  if (!isVisible) return null;
  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg">{message}</div>
  );
};

export default PopupMessage;
