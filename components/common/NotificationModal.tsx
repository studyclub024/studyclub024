import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={48} className="text-green-500" />;
      case 'error':
        return <XCircle size={48} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={48} className="text-yellow-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'error':
        return 'from-red-500 to-rose-600';
      case 'warning':
        return 'from-yellow-500 to-amber-600';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn border border-gray-200 dark:border-slate-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${getColors()} opacity-20 blur-2xl rounded-full`} />
            <div className="relative">
              {getIcon()}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>

          {/* Action button */}
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${getColors()} hover:opacity-90 transition-all active:scale-95 shadow-lg`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
