import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PeopleManager from './pages/PeopleManager';
import ComingSoon from './pages/ComingSoon';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/people" element={<PeopleManager />} />
          <Route path="/academics" element={<ComingSoon title="Academics" />} />
          <Route path="/research" element={<ComingSoon title="Research" />} />
          <Route path="/knowledge-repo" element={<ComingSoon title="Knowledge Repository" />} />
          <Route path="/news" element={<ComingSoon title="Upcoming & In News" />} />
          <Route path="/collaborators" element={<ComingSoon title="Collaborators" />} />
          <Route path="/home-edit" element={<ComingSoon title="Home Page Edit" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;