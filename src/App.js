import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import ExploreStudies from './pages/ExploreStudies/ExploreStudies';
import StudyDetailPage from './pages/StudyDetail/StudyDetail';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Dashboard from './pages/Dashboard/Dashboard';

import { AuthProvider, useAuth } from './AuthContext'; 
import CreateStudy from './pages/CreateStudy/CreateStudy';
import EditStudy from './pages/EditStudy/EditStudy';

function AppContent() {
  const location = useLocation();
  const { currentUser, loadingAuth } = useAuth(); 

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {!isAuthPage && <Header />}
      <div className={`page-content-container ${isAuthPage ? 'auth-page' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/studies" element={<ExploreStudies />} />
          <Route path="/study/:id" element={<StudyDetailPage />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> 
          <Route
            path='/dashboard'
            element={
              loadingAuth ? (
                <p>Loading authentication...</p>
              ) : currentUser ? (
                <Dashboard />
              ) : (
                <Navigate to="/signup" state={{ from: location }} replace />
              )
            }
          />
          <Route
            path='/create-study'
            element={
              loadingAuth ? (
                <p>Loading authentication...</p>
              ) : currentUser ? (
                <CreateStudy />
              ) : (
                <Navigate to="/login" state={{ from: location }} replace />
              )
            }
          />
          <Route
            path='/edit-study/:id'
            element={
              loadingAuth ? (
                <p>Loading authentication...</p> 
              ) : currentUser ? (
                <EditStudy />
              ) : (
                <Navigate to="/login" state={{ from: location }} replace />
              )
            }
          />
        </Routes>
        
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider> 
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;