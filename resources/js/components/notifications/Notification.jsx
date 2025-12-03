import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { COLORS } from '../../constants/colors';

const Notification = ({ 
  type = 'info', // 'success', 'error', 'warning', 'info'
  message, 
  title, 
  isVisible = false, 
  onClose, 
  autoClose = true, 
  duration = 5000,
  position = 'top-right' // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center'
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration]);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      setTimeout(onClose, 300); // Wait for animation to complete
    }
  };

  if (!show) return null;

  // Configuration for different notification types
  const typeConfig = {
    success: {
      icon: CheckCircle,
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      progressColor: 'bg-green-500',
      ringColor: 'focus:ring-green-500',
      defaultTitle: 'Success!'
    },
    error: {
      icon: AlertCircle,
      borderColor: `border-[${COLORS.primary.red}]`,
      iconColor: `text-[${COLORS.primary.red}]`,
      progressColor: `bg-[${COLORS.primary.red}]`,
      ringColor: `focus:ring-[${COLORS.primary.red}]`,
      defaultTitle: 'Error!'
    },
    warning: {
      icon: AlertTriangle,
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      progressColor: 'bg-yellow-500',
      ringColor: 'focus:ring-yellow-500',
      defaultTitle: 'Warning!'
    },
    info: {
      icon: Info,
      borderColor: `border-[${COLORS.primary.blue}]`,
      iconColor: `text-[${COLORS.primary.blue}]`,
      progressColor: `bg-[${COLORS.primary.blue}]`,
      ringColor: `focus:ring-[${COLORS.primary.blue}]`,
      defaultTitle: 'Info'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;
  const displayTitle = title || config.defaultTitle;

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4 animate-slide-in-right',
    'top-left': 'top-4 left-4 animate-slide-in-left',
    'bottom-right': 'bottom-4 right-4 animate-slide-in-right',
    'bottom-left': 'bottom-4 left-4 animate-slide-in-left',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2 animate-slide-in-down'
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      <div 
        className={`bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-md w-full ${config.borderColor} backdrop-blur-sm`}
        style={{ 
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent 
              className={`h-6 w-6 ${config.iconColor}`}
              aria-hidden="true" 
            />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {displayTitle}
            </h3>
            <div className="mt-1 text-sm text-gray-700 leading-relaxed">
              {message}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.ringColor} transition-all duration-200 hover:bg-gray-50`}
              onClick={handleClose}
              aria-label="Close notification"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              className={`h-1 rounded-full ${config.progressColor} transition-all duration-100`}
              style={{ 
                animation: `progress ${duration}ms linear forwards`,
                transformOrigin: 'left center'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
