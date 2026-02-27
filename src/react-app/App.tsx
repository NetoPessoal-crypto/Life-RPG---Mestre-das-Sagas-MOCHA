import { BrowserRouter as Router, Routes, Route } from "react-router";
import { GameProvider } from "@/react-app/context/GameContext";
import DashboardPage from "@/react-app/pages/DashboardPage"; 
import SagasPage from "@/react-app/pages/Sagas";
import MapPage from "@/react-app/pages/MapPage";
import ProfilePage from "@/react-app/pages/ProfilePage"; 
import TavernPage from "@/react-app/pages/TavernPage"; // IMPORTANDO A TAVERNA

export default function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sagas" element={<SagasPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/tavern" element={<TavernPage />} /> {/* ROTA DA TAVERNA */}
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
