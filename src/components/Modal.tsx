import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div 
          className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full ${sizeClasses[size]} animate-slideUp`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-white/50 p-2 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="bg-white px-6 py-6">
            <div>{children}</div>
          </div>
          {footer && (
            <div className="bg-gray-50/50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
