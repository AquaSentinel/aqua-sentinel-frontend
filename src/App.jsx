import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./components/Profile";
import DetectionStudio from "./pages/DetectionStudio";
import GlobePage from "./pages/GlobePage.jsx"
import MapPage from "./pages/MapPage.jsx";
function App() {
  // console.log("Firebase Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID); // do not print this on console
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        {/* <Route path="/DetectionStudio" element={<DetectionStudio />}/> */}
          {/* <Route path="/DetectionStudio/profile" element={<ProfilePage />} /> */}
        <Route path="/globeview" element={<GlobePage />} />
        <Route path="/mapview" element={<MapPage />} />
      </Routes>
      
    </>
  );
}

export default App;
