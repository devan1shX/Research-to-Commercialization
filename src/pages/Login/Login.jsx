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
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

const Login = ({ switchToSignupTab, themeColors, inputStyles }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] =
    useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false);

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      console.log("Login Successful (Email/Password):", userCredential.user);
      alert("Login successful!");
      navigate("/");
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
            errorMessage =
              "Too many login attempts. Please try again later or reset your password.";
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
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const response = await fetch("http://localhost:5000/auth/google-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: idToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `Backend error! status: ${response.status}`
        );
      }
      console.log("Google Login & Backend Sync Successful:", data);
      alert("Successfully logged in with Google!");
      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);
      let errorMessage = "Google login failed. Please try again.";
      if (err.code === "auth/popup-closed-by-user") {
        errorMessage = "Google sign-in was cancelled.";
      } else if (
        err.message.includes("Backend error") ||
        err.message.includes("HTTP error")
      ) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
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
        `Password reset email sent to ${resetEmail}. Please check your inbox (and spam folder).`
      );
    } catch (err) {
      console.error("Error sending password reset email:", err);
      if (err.code === "auth/user-not-found") {
        setForgotPasswordMessage("No user found with this email address.");
      } else {
        setForgotPasswordMessage(
          "Failed to send password reset email. Please try again."
        );
      }
    } finally {
      setLoadingForgotPassword(false);
    }
  };

  return (
    <>
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
            placeholder="you@example.com"
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
            placeholder="••••••••"
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
                    sx={{ color: themeColors.text.secondary }}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
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
              sx={{
                color: themeColors.text.link,
                fontSize: "0.875rem",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
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
              backgroundColor: themeColors.primary.main,
              color: themeColors.primary.contrastText,
              fontWeight: 500,
              fontSize: "0.9rem",
              textTransform: "none",
              py: 1.5,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": { backgroundColor: themeColors.primary.light },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Divider sx={{ my: 2, borderColor: themeColors.border.main }}>
            <Typography
              variant="body2"
              sx={{ color: themeColors.text.secondary, px: 1 }}
            >
              OR
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{
              borderColor: themeColors.googleButton.borderColor,
              color: themeColors.googleButton.color,
              fontWeight: 500,
              fontSize: "0.9rem",
              textTransform: "none",
              py: 1.5,
              borderRadius: "8px",
              backgroundColor: themeColors.googleButton.backgroundColor,
              "&:hover": {
                backgroundColor: themeColors.googleButton.hoverBackground,
                borderColor: themeColors.text.disabled,
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{ color: themeColors.googleButton.color }}
              />
            ) : (
              "Continue with Google"
            )}
          </Button>
        </Stack>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography
            variant="body2"
            sx={{ color: themeColors.text.secondary, fontSize: "0.875rem" }}
          >
            Don't have an account?{" "}
            <Link
              onClick={switchToSignupTab}
              sx={{
                color: themeColors.text.link,
                textDecoration: "none",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Dialog
        open={openForgotPasswordDialog}
        onClose={handleForgotPasswordClose}
        PaperProps={{ sx: { borderRadius: "12px", p: 1 } }}
      >
        <DialogTitle sx={{ color: themeColors.text.primary, fontWeight: 600 }}>
          Reset Your Password
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: themeColors.text.secondary, mb: 2 }}>
            Enter your email address below and we'll send you a link to reset
            your password.
          </DialogContentText>
          <TextField
            autoFocus
            id="reset-email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => {
              setResetEmail(e.target.value);
              if (forgotPasswordMessage) setForgotPasswordMessage("");
            }}
            disabled={loadingForgotPassword}
            sx={inputStyles}
          />
          {forgotPasswordMessage && (
            <Typography
              color={
                forgotPasswordMessage.includes("sent")
                  ? "success.main"
                  : "error"
              }
              variant="body2"
              sx={{ mt: 1, textAlign: "center" }}
            >
              {forgotPasswordMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleForgotPasswordClose}
            disabled={loadingForgotPassword}
            sx={{
              color: themeColors.text.secondary,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendResetEmail}
            variant="contained"
            disabled={loadingForgotPassword}
            sx={{
              backgroundColor: themeColors.primary.main,
              color: themeColors.primary.contrastText,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { backgroundColor: themeColors.primary.light },
            }}
          >
            {loadingForgotPassword ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Send Reset Email"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
