// Login.jsx
import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Paper, InputAdornment, IconButton,
  Link, Stack, Divider, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Google as GoogleIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://r2c.iiitd.edu.in";

const Login = ({ switchToSignupTab, themeColors, inputStyles }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false);

  const handleInputChange = (field) => (event) => {
    setLoginData((prev) => ({ ...prev, [field]: event.target.value }));
    if (error) setError("");
  };

  const handleLogin = async (event) => {
    // This function for standard email/password login is fine as is.
    event.preventDefault();
    setError("");
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      let msg = "Failed to login. Please check your credentials.";
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        msg = "Invalid email or password.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/auth/google-signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      // **KEY FIX**: Handle non-JSON server responses (crashes)
      if (!response.ok) {
        // Clone the response to safely read the body
        const responseClone = response.clone();
        try {
          // Attempt to parse the clone as JSON to get backend error message
          const errorData = await responseClone.json();
          throw new Error(errorData.message || `Server responded with status: ${response.status}`);
        } catch (jsonError) {
          // If JSON parsing fails, the response is HTML. Log it for debugging.
          const errorText = await response.text();
          console.error("--- SERVER CRASH RESPONSE (HTML) ---");
          console.error(errorText); // THIS IS THE MOST IMPORTANT DEBUGGING LINE
          console.error("------------------------------------");
          throw new Error("Server returned an invalid response (likely a crash). See console for details.");
        }
      }

      const data = await response.json();
      console.log("Google Login & Backend Sync Successful:", data);
      alert("Successfully logged in with Google!");
      navigate("/");

    } catch (err) {
      console.error("Google Login Flow Error:", err);
      // Display a user-friendly error message
      setError(err.message || "An unexpected error occurred. Please try again.");

      // IMPORTANT: Sign out to prevent inconsistent state if backend sync fails
      if (auth.currentUser) {
        await signOut(auth);
      }
    } finally {
      setLoading(false);
    }
  };

  // No changes needed for the forgot password logic or the JSX rendering below
  const handleForgotPasswordOpen = () => setOpenForgotPasswordDialog(true);
  const handleForgotPasswordClose = () => setOpenForgotPasswordDialog(false);
  const handleSendResetEmail = async () => { /* Logic is fine */ };

  return (
    <>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: "16px", border: `1px solid ${themeColors.border.main}`, backgroundColor: themeColors.background.paper }}>
        <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: themeColors.text.primary, mb: 1 }}>Login to Your Account</Typography>
          <Typography variant="body1" sx={{ color: themeColors.text.secondary }}>Welcome back! Please enter your details.</Typography>
        </Box>

        {error && (<Typography color="error" variant="body2" sx={{ textAlign: "center", mb: 2, whiteSpace: "pre-wrap" }}>{error}</Typography>)}

        <Stack spacing={2.5} component="form" onSubmit={handleLogin}>
          {/* Your TextFields, Buttons, and other JSX elements are fine. */}
          {/* ... (No changes to the JSX structure) ... */}
          <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleLogin} disabled={loading} sx={{ borderColor: themeColors.googleButton.borderColor, color: themeColors.googleButton.color, fontWeight: 500, fontSize: "0.9rem", textTransform: "none", py: 1.5, borderRadius: "8px", backgroundColor: themeColors.googleButton.backgroundColor, "&:hover": { backgroundColor: themeColors.googleButton.hoverBackground, borderColor: themeColors.text.disabled, }, }}>
            {loading ? <CircularProgress size={24} sx={{ color: themeColors.googleButton.color }}/> : "Continue with Google"}
          </Button>
        </Stack>
        
        <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: themeColors.text.secondary, fontSize: "0.875rem" }}>
                Don't have an account?{" "}
                <Link onClick={switchToSignupTab} sx={{ color: themeColors.text.link, textDecoration: "none", fontWeight: 500, cursor: "pointer", "&:hover": { textDecoration: "underline" }, }}>
                    Sign Up
                </Link>
            </Typography>
        </Box>
      </Paper>

      {/* The Dialog for 'Forgot Password' is also fine. */}
      <Dialog open={openForgotPasswordDialog} onClose={handleForgotPasswordClose}>
        {/* ... (No changes to the Dialog JSX) ... */}
      </Dialog>
    </>
  );
};

export default Login;
