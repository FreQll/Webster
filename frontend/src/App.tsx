import { Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />

      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
