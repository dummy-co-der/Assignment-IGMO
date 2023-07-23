import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormPage from "./pages/FormPage";
import SecondPage from "./pages/SecondPage";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/second" element={<SecondPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;