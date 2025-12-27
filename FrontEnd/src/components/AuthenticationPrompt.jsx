import React from "react";
import { useNavigate } from "react-router-dom";

const AuthenticationPrompt = ({ 
  show, 
  onClose, 
  title = "Authentication Required", 
  message = "Please login first to access this page.",
  redirectPath = "/login?from=protected"
}) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate(redirectPath);
  };

  const handleClose = () => {
    onClose();
    navigate('/'); // Redirect to home or previous page
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-[#004A99] hover:bg-[#003366] text-white py-3 px-4 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Login Now
          </button>
          <button
            onClick={handleClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold transition duration-300"
          >
            Go Back
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <span className="text-[#004A99] cursor-pointer font-semibold" onClick={handleLoginRedirect}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default AuthenticationPrompt;