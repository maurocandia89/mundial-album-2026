import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store/auth";
import Bienvenida from "../../frontend/src/pages/Bienvenida";
import Login from "../../frontend/src/pages/Login";
import Album from "../../frontend/src/pages/Album";

function App() {
  const token = useAuth((s) => s.token);

  return (
    <Routes>
      <Route path="/" element={<Bienvenida />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/album"
        element={token ? <Album /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;