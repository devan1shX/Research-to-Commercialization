import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// --- CHANGE: Add React and useEffect ---
import React, { useEffect } from 'react'; 
// --- CHANGE: Add Firebase imports for handling the redirect result ---
import { getRedirectResult } from 'firebase/auth';
import { auth } from './firebaseConfig'; 

// Your component imports
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import ExploreStudies from './pages/ExploreStudies/ExploreStudies';
import StudyDetailPage from './pages/StudyDetail/StudyDetailPage';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Dashboard from './pages/Dashboard/Dashboard';
import BulkCreateStudy from './pages/BulkCreateStudy/BulkCreateStudy';
import CreateStudy from './pages/CreateStudy/CreateStudy';
import EditStudy from './pages/EditStudy/EditStudy';
import UserStudyDetail from './pages/UserStudyDetail/UserStudyDetail';

// Your context imports
import { AuthProvider, useAuth } from './AuthContext';
import { NotificationProvider, useNotification } from './NotificationContext';
import { BulkAnalysisProvider } from './BulkAnalysisContext';

function AppContent() {
    const location = useLocation();
    const { currentUser, loadingAuth } = useAuth();
    // Assuming useNotification provides a function to show notifications
    const { showNotification } = useNotification(); 

    // --- CHANGE: This useEffect hook handles the Google Sign-In redirect ---
    useEffect(() => {
        const handleAuthRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                // Check if a result exists, which means the user is returning from Google sign-in
                if (result) {
                    // Show a notification that the login was successful
                    showNotification('Successfully logged in with Google!', 'success');
                    
                    const user = result.user;
                    const idToken = await user.getIdToken();

                    // Sync the user with your backend. This is the same logic
                    // that was previously in your Login.jsx file.
                    await fetch("/api/auth/google-signin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ idToken: idToken }),
                    });
                    
                    // After this, the onAuthStateChanged listener in your AuthContext
                    // will detect the user, and the app will navigate correctly.
                }
            } catch (error) {
                console.error("Error handling Google redirect:", error);
                showNotification('Failed to log in with Google. Please try again.', 'error');
            }
        };

        handleAuthRedirect();
    }, [showNotification]); // Run this effect once when the app loads

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    // Your existing routing logic is perfect and doesn't need to change.
    // It already handles the loading state and redirects correctly.
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
                                <p>Loading authentication...</p> // Or a spinner component
                            ) : currentUser ? (
                                <Dashboard />
                            ) : (
                                <Navigate to="/login" state={{ from: location }} replace />
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
                        path='/bulk-create-study'
                        element={
                            loadingAuth ? (
                                <p>Loading authentication...</p>
                            ) : currentUser ? (
                                <BulkCreateStudy />
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
                    <Route
                        path='/my-study/:id'
                        element={
                            loadingAuth ? (
                                <p>Loading authentication...</p>
                            ) : currentUser ? (
                                <UserStudyDetail />
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
            <NotificationProvider>
                <Router>
                    <BulkAnalysisProvider>
                        <AppContent />
                    </BulkAnalysisProvider>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
