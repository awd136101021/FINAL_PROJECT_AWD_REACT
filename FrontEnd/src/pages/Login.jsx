import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    fullName: "", 
    email: "", 
    password: "",
    role: "student" // Default role
  });
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Basic validation
    if (!formData.email.includes("@")) {
      setIsLoading(false);
      return setMessage("Please enter a valid email address.");
    }
    
    if (!isLogin && !validatePassword(formData.password)) {
      setIsLoading(false);
      return setMessage(
        "Password must include uppercase, lowercase, special character and be at least 8 characters long."
      );
    }

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      // Include role in data to send
      const dataToSend = isLogin 
        ? { 
            email: formData.email, 
            password: formData.password,
            role: formData.role
          }
        : { ...formData };

      const { data } = await axios.post(endpoint, dataToSend);
      setMessage(data.message);

      if (isLogin) {
        // For LOGIN: Store user data and redirect based on role
        if (data.message.toLowerCase().includes("successful") || data.token) {
          const userData = {
            fullName: data.user?.fullName || dataToSend.email.split('@')[0],
            email: dataToSend.email,
            role: data.user?.role || formData.role,
            loginTime: new Date().toISOString(),
            userId: data.user?.id
          };
          
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", data.token || "demo-token");
          
          setFormData({ fullName: "", email: "", password: "", role: "student" });
          
          setMessage("Login successful! Redirecting...");
          
          setTimeout(() => {
            // Redirect to dashboard for both roles
            navigate("/dashboard");
          }, 1500);
        }
      } else {
        // For REGISTRATION: Show success message and switch to login mode
        if (data.message.toLowerCase().includes("successful") || data.message.toLowerCase().includes("registered")) {
          setFormData({ fullName: "", email: "", password: "", role: "student" });
          setMessage("Registration successful! Please login with your credentials.");
          
          setTimeout(() => {
            setIsLogin(true);
            setMessage("Please login with your new account.");
          }, 2000);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "A network error occurred. Please try again.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: "", email: "", password: "", role: "student" });
    setMessage("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
      style={{ backgroundImage: "url('/images/lab1.jpg')", backgroundAttachment: "fixed" }}
    >
      {/* Enhanced Dark Overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Centered Content Container */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo/Header Section */}
        <div className="text-center mb-4 mt-16">
          <h1 className="text-2xl font-bold text-white mb-1">Computer Science Portal</h1>
          <p className="text-white/80 text-xs">Academic Support System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 w-full border border-white/20">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white mb-1">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-white/70 text-xs">
              {isLogin ? "Sign in to your account" : "Join our academic community"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 text-sm"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 text-sm"
              />
            </div>

            {/* Password Field with Toggle */}
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10 transition duration-300 text-sm"
              />

              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition duration-200 focus:outline-none"
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              >
                {isPasswordVisible ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.057 10.057 0 0112 19c-4.418 0-8.232-2.352-10-6C2.768 8.352 6.582 6 11 6c1.233 0 2.414.305 3.5.856M4 4l16 16"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Password requirements hint for registration - compact version */}
            {!isLogin && (
              <div className="text-xs text-white/70 bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="font-semibold mb-1 text-white">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-1">
                  <div className={`flex items-center ${formData.password.length >= 8 ? "text-green-300" : ""}`}>
                    <span className="mr-1 text-xs">{formData.password.length >= 8 ? "✓" : "•"}</span>
                    Min 8 chars
                  </div>
                  <div className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? "text-green-300" : ""}`}>
                    <span className="mr-1 text-xs">{/(?=.*[A-Z])/.test(formData.password) ? "✓" : "•"}</span>
                    Uppercase
                  </div>
                  <div className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? "text-green-300" : ""}`}>
                    <span className="mr-1 text-xs">{/(?=.*[a-z])/.test(formData.password) ? "✓" : "•"}</span>
                    Lowercase
                  </div>
                  <div className={`flex items-center ${/(?=.*[\W_])/.test(formData.password) ? "text-green-300" : ""}`}>
                    <span className="mr-1 text-xs">{/(?=.*[\W_])/.test(formData.password) ? "✓" : "•"}</span>
                    Special char
                  </div>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div className="w-full">
              <label className="block text-xs font-medium text-white mb-2">
                {isLogin ? "Login as:" : "Register as:"}
              </label>
              <div className="flex gap-2">
                <label className="flex items-center flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-full p-2 rounded-lg border transition duration-300 ${
                    formData.role === "student" 
                      ? "bg-blue-500/20 border-blue-400 text-white" 
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                  }`}>
                    <div className="text-center">
                      <div className="font-medium text-sm">Student</div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-full p-2 rounded-lg border transition duration-300 ${
                    formData.role === "admin" 
                      ? "bg-purple-500/20 border-purple-400 text-white" 
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                  }`}>
                    <div className="text-center">
                      <div className="font-medium text-sm">Admin</div>
                    </div>
                  </div>
                </label>
              </div>
              
              {/* Admin registration note */}
              {!isLogin && formData.role === "admin" && (
                <div className="mt-2 p-2 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                  <p className="text-xs text-purple-200">
                    <strong>Note:</strong> Admin accounts require verification.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider transition duration-300 transform focus:outline-none focus:ring-4 shadow-lg ${
                formData.role === "admin" 
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-purple-300/50 shadow-purple-500/25" 
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-300/50 shadow-blue-500/25"
              } text-white text-sm ${
                isLoading 
                  ? "opacity-70 cursor-not-allowed" 
                  : "hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                isLogin ? 
                  (formData.role === "admin" ? "Sign In as Admin" : "Sign In as Student") 
                  : 
                  (formData.role === "admin" ? "Create Admin Account" : "Create Student Account")
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center font-semibold backdrop-blur-md border text-sm ${
              message.toLowerCase().includes("successful") || message.toLowerCase().includes("please login")
                ? "bg-green-500/20 text-green-200 border-green-400/30"
                : "bg-red-500/20 text-red-200 border-red-400/30"
            }`}>
              {message}
            </div>
          )}

          <div className="text-center mt-4 pt-4 border-t border-white/10">
            <p className="text-white/70 text-xs">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-white font-semibold hover:text-blue-200 transition duration-200 focus:outline-none focus:underline text-xs"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Professional Footer */}
          <div className="mt-4 text-center">
            <p className="text-white/40 text-xs">
              Secure Academic Portal • Computer Science Department
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;