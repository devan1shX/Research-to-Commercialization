import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import ExploreStudies from './pages/ExploreStudies/ExploreStudies';
import StudyDetailPage from './pages/StudyDetail/StudyDetail';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="page-content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studies" element={<ExploreStudies />} />
            <Route path="/study/:id" element={<StudyDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;