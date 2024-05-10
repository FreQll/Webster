import { Route, Routes } from "react-router-dom";
import Auth from "./pages/SignUp";
import Main from "./pages/Main";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />

      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
