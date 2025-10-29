import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../utils/utils';
import loginbackground from '../assets/images/loginbackground.png';
import signupSideImage from '../assets/images/signupImage.png';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import MyNavBar from '../components/MyNavBar';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      // 1️⃣ Open Google Sign-In popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2️⃣ Get Firebase ID token to send to backend
      const token = await user.getIdToken();

      console.log("✅ Google user:", user.email);
      console.log("🔑 Firebase ID Token:", token);

      // 3️⃣ Send token to your Flask backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🧠 Server Response:", response.data);
      handleSucess(`Welcome ${user.displayName || user.email}!`);
      setTimeout(() => navigate('/DetectionStudio'), 2000); // redirect after success

    } catch (error) {
      console.error("❌ Google Sign-In error:", error);
      handleError("Google Sign-In failed! Please try again.");
    }
  };

  return (
    <>
    <MyNavBar />
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
          
          {/* Left Section */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-center md:text-left">
              Aqua Sentinel
            </h1>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-center md:text-left">
              Sign up with Google
            </h1>
            <p className="text-gray-300 mb-8 text-center md:text-left">
              Use your Google account to create or access your account.
            </p>

            {/* Google Sign-In Button */}
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={handleGoogleSignUp}
                className="w-full py-3 bg-white text-gray-800 rounded-lg font-semibold 
                           flex items-center justify-center gap-3 hover:bg-gray-100 transition-all duration-300"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google logo"
                  className="w-6 h-6"
                />
                Continue with Google
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Already have an account?{" "}
                <span
                  onClick={() => navigate('/login')}
                  className="text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
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
    </>
  );
};

export default SignUpPage;
