'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
  mode?: 'fullscreen' | 'component';
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...', 
  isVisible,
  mode = 'fullscreen',
  className = ''
}) => {
  const [loadingStyle, setLoadingStyle] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setLoadingStyle(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const renderLoadingStyle = () => {
    switch (loadingStyle) {
      case 0:
        return (
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className='relative w-16 h-16'
          >
            <div className='absolute inset-0 border-4 border-primary/30 rounded-full' />
            <div className='absolute inset-0 border-4 border-t-primary-400 border-r-transparent border-b-transparent border-l-transparent rounded-full' />
            <div
              className='absolute inset-0 border-4 border-r-primary-500 border-t-transparent border-b-transparent border-l-transparent rounded-full'
              style={{ transform: 'rotate(120deg)' }}
            />
            <div
              className='absolute inset-0 border-4 border-b-primary-600 border-t-transparent border-r-transparent border-l-transparent rounded-full'
              style={{ transform: 'rotate(240deg)' }}
            />
          </motion.div>
        );
      case 1:
        return (
          <div className='relative w-16 h-16'>
            <motion.div
              className='absolute inset-0 border-4 border-primary-400 rounded-full'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className='absolute inset-0 border-4 border-primary-500 rounded-full'
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        );
      case 2:
        return (
          <div className='flex gap-2'>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className='w-4 h-4 bg-primary-500 rounded-full'
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );
      case 3:
        return (
          <div className='relative w-16 h-16'>
            <motion.div
              className='absolute inset-0'
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className='absolute top-0 left-1/2 w-2 h-2 bg-primary-400 rounded-full transform -translate-x-1/2' />
              <div
                className='absolute top-0 left-1/2 w-2 h-2 bg-primary-500 rounded-full transform -translate-x-1/2'
                style={{ transform: 'rotate(120deg) translate(-50%, 0)' }}
              />
              <div
                className='absolute top-0 left-1/2 w-2 h-2 bg-primary-600 rounded-full transform -translate-x-1/2'
                style={{ transform: 'rotate(240deg) translate(-50%, 0)' }}
              />
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${mode === 'fullscreen' ? 'fixed inset-0' : 'absolute inset-0'} z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm ${className}`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className='relative rounded-lg p-8 flex flex-col items-center gap-6'
          >
            <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-primary-500/5' />
            <div className='absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/10 to-primary-500/10 blur-lg' />

            {renderLoadingStyle()}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='relative flex flex-col items-center gap-2'
            >
              <motion.p
                className='text-primary-400 text-lg font-medium tracking-wider'
                animate={{
                  textShadow: [
                    '0 0 8px rgba(167,139,250,0.5)',
                    '0 0 16px rgba(167,139,250,0.8)',
                    '0 0 8px rgba(167,139,250,0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                {message}
              </motion.p>
              <div className='h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full overflow-hidden'>
                <motion.div
                  className='h-full bg-primary-500'
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
