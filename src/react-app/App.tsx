import { BrowserRouter as Router, Routes, Route } from "react-router";
import { GameProvider } from "@/react-app/context/GameContext";
import DashboardPage from "@/react-app/pages/DashboardPage"; // A nova página que você criou
import SagasPage from "@/react-app/pages/Sagas";
import MapPage from "@/react-app/pages/MapPage";

export default function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          {/* Agora a Dashboard é a sua "Home" (abriu, viu o status) */}
          <Route path="/" element={<DashboardPage />} />
          
          <Route path="/sagas" element={<SagasPage />} />
          <Route path="/map" element={<MapPage />} />
          
          {/* Se você quiser que o botão de Perfil também leve para a Dashboard */}
          <Route path="/profile" element={<DashboardPage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
