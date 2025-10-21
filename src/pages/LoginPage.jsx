import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSucess } from "../utils/utils";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import MyNavBar from "../components/MyNavBar";

const LoginPage = () => {
  const navigate = useNavigate();



  // -----------------------------
  // 🔹 Manual Login Flow
  // -----------------------------


  // -----------------------------
  // 🔹 Google Login Flow
  // -----------------------------
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await axios.post(
        "http://127.0.0.1:5050/api/login/google",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleSucess(`Welcome back ${user.displayName || user.email}!`);
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUser", user.displayName || user.email);
      setTimeout(() => navigate("/DetectionStudio"), 1500);
    } catch (error) {
      console.error("❌ Google login failed:", error);
      handleError("Google Login failed. Please try again.");
    }
  };

  // -----------------------------
  // 🔹 UI
  // -----------------------------
  return (
    <>
      <MyNavBar />
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <iframe
          title="Background Live Stream"
          src="https://www.youtube.com/embed/jzx_n25g3kA?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=jzx_n25g3kA"
          className="absolute top-1/2 left-1/2 w-[200%] h-[200%] md:w-[150%] md:h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ border: "none" }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          aria-hidden="true"
        />

        <div className="min-h-screen flex items-center justify-center relative z-10 w-full max-w-4xl">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg">
            <div className="bg-black/50 p-8 sm:p-12 rounded-2xl backdrop-blur-xl shadow-2xl border border-gray-600/20">
              <div className="mb-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  Login
                </h1>
                <p className="text-gray-300 text-md sm:text-lg">
                  Access your account
                </p>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-white text-gray-800 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all duration-300"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google logo"
                  className="w-6 h-6"
                />
                Continue with Google
              </button>

              <div className="text-center mt-6 pt-4 border-t border-gray-600/20">
                <p className="text-gray-400">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
