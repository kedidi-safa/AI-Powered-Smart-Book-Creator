import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex items-center space-x-3 relative">
      <div className="h-10 w-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center text-sm font-medium text-white">
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
        )}
      </div>
      <div className="hidden sm:block">
        <span className="block text-sm font-medium text-gray-900">
          {user?.name}
        </span>
        <span className="block text-xs text-gray-500">{email}</span>
      </div>

      <button
        onClick={onToggle}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-10 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-20">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="font-medium">{companyName}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            View Profile
          </button>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
