import { X } from "lucide-react";
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/10 bg-opacity-25 transition-opacity" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-xl p-6 space-y-4 relative z-10 w-full max-w-md text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
