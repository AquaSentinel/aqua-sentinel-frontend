import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../utils/utils';
import loginbackground from '../assets/images/loginbackground.png';
import signupSideImage from '../assets/images/signupImage.png'; // <-- add your own image here

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((curr) => ({ ...curr, [name]: value }));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) return handleError("Passwords do not match");

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      const { message, success, error } = result;

      if (success) {
        handleSucess(message);
        setTimeout(() => navigate('/login'), 3000);
      } else if (error) {
        handleError(error?.[0]?.message || "An unexpected error occurred");
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${loginbackground})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Container */}
      <div className="relative z-10 max-w-6xl w-full mx-4 md:mx-8 lg:mx-auto bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-xl border border-white/10">
          
          {/* Left Form Section */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-center md:text-left">
              Aqua Sentinel
            </h1>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-center md:text-left">
              Sign up now
            </h1>
            <p className="text-gray-300 mb-8 text-center md:text-left">
              Create your account to get started
            </p>

            <form className="space-y-6" onSubmit={handleSignUp}>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-500/30 text-white 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-500/30 text-white 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-500/30 text-white 
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                  <span
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-500/30 text-white 
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm your password"
                    required
                  />
                  <span
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-gray-300 text-sm">
                  <input type="checkbox" className="mr-2 accent-blue-500" /> Subscribe to our newsletter
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold 
                           hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Sign Up
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Right Image Section */}
          <div className="hidden md:block">
            <img
              src={signupSideImage}
              alt="Sign Up Illustration"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
