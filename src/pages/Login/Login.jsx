import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Stack,
  Divider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithRedirect, 
  sendPasswordResetEmail,
} from "firebase/auth";

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
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (field) => (event) => {
    setLoginData((prev) => ({ ...prev, [field]: event.target.value }));
    if (error) setError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      setNotification({
        open: true,
        message: "Login successful! Redirecting...",
        severity: "success",
      });
    } catch (err) {
      console.error("Login Error:", err);
      let errorMessage = "Failed to login. Please check your credentials.";
      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password.";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many login attempts. Please try again later.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled.";
            break;
          default:
            errorMessage = "An unexpected error occurred. Please try again.";
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error("Google Login Start Error:", err);
      setError("Could not start Google sign-in. Please try again.");
      setLoading(false);
    }
  };

  const handleForgotPasswordOpen = () => {
    setOpenForgotPasswordDialog(true);
    setResetEmail("");
    setForgotPasswordMessage("");
    setError("");
  };

  const handleForgotPasswordClose = () => {
    setOpenForgotPasswordDialog(false);
  };

  const handleSendResetEmail = async () => {
    if (!resetEmail) {
      setForgotPasswordMessage("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setForgotPasswordMessage("Please enter a valid email address.");
      return;
    }
    setLoadingForgotPassword(true);
    setForgotPasswordMessage("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setForgotPasswordMessage(
        `Password reset email sent to ${resetEmail}.`
      );
    } catch (err) {
      console.error("Error sending password reset email:", err);
      if (err.code === "auth/user-not-found") {
        setForgotPasswordMessage("No user found with this email address.");
      } else {
        setForgotPasswordMessage("Failed to send password reset email.");
      }
    } finally {
      setLoadingForgotPassword(false);
    }
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  const gradientTextStyle = {
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent",
    display: "inline-block",
  };

  return (
    <>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: "16px",
          border: `1px solid ${themeColors.border.main}`,
          backgroundColor: themeColors.background.paper,
        }}
      >
        <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: themeColors.text.primary, mb: 1 }}
          >
            Login to Your Account
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: themeColors.text.secondary }}
          >
            Welcome back! Please enter your details.
          </Typography>
        </Box>
        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ textAlign: "center", mb: 2, whiteSpace: "pre-wrap" }}
          >
            {error}
          </Typography>
        )}
        <Stack spacing={2.5} component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            required
            label="Email"
            type="email"
            value={loginData.email}
            onChange={handleInputChange("email")}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email
                    sx={{
                      color: themeColors.text.secondary,
                      fontSize: "1.1rem",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ ...inputStyles, mb: 0 }}
          />
          <TextField
            fullWidth
            required
            label="Password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={handleInputChange("password")}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock
                    sx={{
                      color: themeColors.text.secondary,
                      fontSize: "1.1rem",
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ ...inputStyles, mb: 0 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: -1.5,
              mb: 1,
            }}
          >
            <Link
              onClick={handleForgotPasswordOpen}
              sx={{ ...gradientTextStyle, cursor: "pointer" }}
            >
              Forgot Password?
            </Link>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              background:
                "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
              py: 1.5,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Continue with Google
          </Button>
        </Stack>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link onClick={switchToSignupTab} sx={{ ...gradientTextStyle, cursor: "pointer" }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
      {/* Omitted Dialog JSX for brevity */}
    </>
  );
};

export default Login;
