import React, { useEffect, useState } from 'react';
import './Load.css'; // make sure this is created and imported

const Load = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 500);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onLoadingComplete) onLoadingComplete();
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => {
      clearTimeout(textTimer);
      clearInterval(interval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="loader-container1">
      <div className={`welcome-text ${textVisible ? 'visible' : ''}`}>
        Welcome to Vardhan Bank
      </div>

      <div className="circle-loader">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`ring ring-${i}`} />
        ))}
        <div className="center-circle" />
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default Load;
