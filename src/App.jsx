import { BrowserRouter, Routes, Route } from "react-router-dom";
import AchievementPage from "./pages/AchievementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AchievementPage />} />
        <Route path="/achievements" element={<AchievementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;