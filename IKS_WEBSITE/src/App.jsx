import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

import People from "./pages/People";
import Events from "./pages/Events";
import Academics from "./pages/Academics";
import { Research, Repository, News, Collaborators } from "./pages/Pages";
import About from "./pages/About";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/people" element={<People />} />
            <Route path="/events" element={<Events />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/research" element={<Research />} />
            <Route path="/repository" element={<Repository />} />
            <Route path="/news" element={<News />} />
            <Route path="/collaborators" element={<Collaborators />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;