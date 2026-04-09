import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Album } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <Album className="h-5 w-5 text-white" />
              </div>
              <span className="text-black font-bold text-xl">
                SmartBook Creator
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={user?.avatar || ""}
              companyName={user?.companyName || ""}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
