import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/Index";
import Login from "./components/login";
import Register from "./components/Register";
import UserProfile from './components/UserProfile';
import Feedback from './components/Feedback'
import { AuthProvider } from "./contexts/AuthContext";
import UserSettings from "./components/usersetting";
import "./styles/Index.scss";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/settings" element={<UserSettings />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
