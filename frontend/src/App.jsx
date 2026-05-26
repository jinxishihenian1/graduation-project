import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Community from "./pages/Community";
import Character from "./pages/Character";
import Diary from "./pages/Diary";
import DiaryWrite from "./pages/DiaryWrite";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/character" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/community" element={<Community />} />
        <Route path="/character" element={<Character />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/diary/write/:date" element={<DiaryWrite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;