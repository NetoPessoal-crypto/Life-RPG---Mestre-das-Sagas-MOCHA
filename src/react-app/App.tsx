import { BrowserRouter as Router, Routes, Route } from "react-router";
import { GameProvider } from "@/react-app/context/GameContext";
import HomePage from "@/react-app/pages/Home";
import SagasPage from "@/react-app/pages/Sagas";
import MapPage from "@/react-app/pages/MapPage";
import ProfilePage from "@/react-app/pages/Profile";

export default function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sagas" element={<SagasPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
