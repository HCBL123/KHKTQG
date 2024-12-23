import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorNavigation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Đăng xuất thất bại', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">MedRehab</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/doctor/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Bảng Điều Khiển
              </Link>
              <Link to="/doctor/patients" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Bệnh Nhân
              </Link>
              <Link to="/doctor/appointments" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Lịch Hẹn
              </Link>
              <Link to="/doctor/treatments" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Điều Trị
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/doctor/settings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Cài Đặt
            </Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavigation; 