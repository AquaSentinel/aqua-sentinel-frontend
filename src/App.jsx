import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./components/Profile";
import DetectionStudio from "./pages/DetectionStudio";
function App() {
  console.log("Firebase Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/home" element={<DetectionStudio />}/>
          <Route path="/home/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
