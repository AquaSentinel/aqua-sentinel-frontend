import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./components/Profile";
import ShipDetectionPage from "./pages/ShipDetectionPage";
import MarineDebrisDetectionPage from "./pages/MarineDebrisDetectionPage";
import DetectionStudio from "./pages/DetectionStudio";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/home" element={<DetectionStudio />}/>
          <Route path="/home/profile" element={<ProfilePage />} />
          <Route path="/home/ship-detection" element={<ShipDetectionPage />} />
          <Route path="/home/marine-debris-detection" element={<MarineDebrisDetectionPage />} />
      </Routes>
    </>
  );
}

export default App;
