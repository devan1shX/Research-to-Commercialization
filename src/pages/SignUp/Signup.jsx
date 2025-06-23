import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
  FormControl,
  Select,
  MenuItem,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Divider,
  CircularProgress,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AccountCircle,
  PhoneAndroid,
  WorkOutline,
  Google as GoogleIcon,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";

import Login from "../Login/Login";

const themeColors = {
  primary: { main: "#1976D2", light: "#64B5F6", contrastText: "#FFFFFF" },
  secondary: { main: "#673AB7", contrastText: "#FFFFFF" },
  text: {
    primary: "#212529",
    secondary: "#666666",
    disabled: "#AEAEAE",
    link: "#1976D2",
  },
  background: { page: "#F5F5F5", paper: "#FFFFFF", default: "#FFFFFF" },
  border: { main: "#E0E0E0", inputFocused: "#1976D2" },
  googleButton: {
    borderColor: "#E0E0E0",
    color: "#424242",
    backgroundColor: "#FFFFFF",
    hoverBackground: "#F9F9F9",
  },
  tab: {
    background: "#F0F0F0",
    selectedText: "#1976D2",
    selectedBackground: "#FFFFFF",
    defaultText: "#666666",
  },
};

const Signup = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const steps = ["Personal Info", "Account Security", "Complete Setup"];

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (error) setError("");
  };

  const validateStep = (step) => {
    setError("");
    if (step === 0) {
      if (!formData.displayName || !formData.role) {
        setError("Please fill in your name and select a role.");
        return false;
      }
    } else if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all security fields.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match!");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!validateStep(0) || !validateStep(1)) {
      if (!error)
        setError("Please ensure all required fields are completed correctly.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formData.displayName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      alert("Signup successful! Please login.");
      setActiveTab(0);
      setCurrentStep(0);
      setFormData({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        phone: "",
      });
    } catch (err) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const response = await fetch("http://localhost:5000/auth/google-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: idToken,
          role: formData.role,
          phone: formData.phone,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      alert("Successfully signed in with Google!");
      setActiveTab(0);
      setCurrentStep(0);
      setFormData({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        phone: "",
      });
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentStep(0);
    setError("");
    setFormData({
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      phone: "",
    });
  };

  const roles = [
    { value: "student", label: "Student" },
    { value: "faculty", label: "Faculty" },
    { value: "industry", label: "Industry Professional" },
    { value: "individual", label: "Individual Learner" },
  ];

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: themeColors.background.paper,
      fontSize: "0.9rem",
      "& fieldset": { borderColor: themeColors.border.main },
      "&:hover fieldset": { borderColor: themeColors.primary.light },
      "&.Mui-focused fieldset": {
        borderColor: themeColors.border.inputFocused,
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: themeColors.text.secondary,
      "&.Mui-focused": { color: themeColors.primary.main },
    },
    mb: 2.5,
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={300} key="step0">
            <Stack spacing={inputStyles.mb}>
              <TextField
                fullWidth
                required
                label="Display Name"
                placeholder="Your Name"
                value={formData.displayName}
                onChange={handleInputChange("displayName")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle
                        sx={{
                          color: themeColors.text.secondary,
                          fontSize: "1.1rem",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{ ...inputStyles, mb: 0 }}
                error={!!(error && !formData.displayName)}
                helperText={
                  error && !formData.displayName
                    ? "Display name is required"
                    : ""
                }
              />
              <FormControl
                fullWidth
                sx={{ ...inputStyles, mb: 0 }}
                error={!!(error && !formData.role)}
              >
                <InputLabel
                  id="role-label-id-step0"
                  shrink={formData.role ? true : undefined}
                  sx={{
                    ...(formData.role && {
                      transform: "translate(14px, -9px) scale(0.75)",
                    }),
                  }}
                >
                  Role
                </InputLabel>
                <Select
                  labelId="role-label-id-step0"
                  value={formData.role}
                  onChange={handleInputChange("role")}
                  label="Role"
                  startAdornment={
                    <InputAdornment
                      position="start"
                      sx={{
                        mr: 1,
                        ml: -0.5,
                        color: themeColors.text.secondary,
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      <WorkOutline sx={{ fontSize: "1.1rem" }} />
                    </InputAdornment>
                  }
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                >
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {error && !formData.role && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ pl: "14px", pt: "3px" }}
                  >
                    Role is required
                  </Typography>
                )}
              </FormControl>
              <TextField
                fullWidth
                type="tel"
                label="Phone (Optional)"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroid
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
              <Box sx={{ my: 2 }}>
                <Divider sx={{ mb: 2, borderColor: themeColors.border.main }}>
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
                  onClick={handleGoogleSignup}
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
                  {" "}
                  {loading && activeTab === 1 ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: themeColors.googleButton.color }}
                    />
                  ) : (
                    "Continue with Google"
                  )}{" "}
                </Button>
              </Box>
            </Stack>
          </Fade>
        );
      case 1:
        return (
          <Fade in={true} timeout={300} key="step1">
            <Stack spacing={inputStyles.mb}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange("email")}
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
                error={
                  !!(
                    error &&
                    (!formData.email ||
                      (formData.email &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)))
                  )
                }
                helperText={
                  error &&
                  (!formData.email ||
                    (formData.email &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)))
                    ? "Valid email is required"
                    : ""
                }
              />
              <TextField
                fullWidth
                required
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange("password")}
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
                helperText="At least 6 characters"
                error={
                  !!(
                    error &&
                    (!formData.password || formData.password.length < 6)
                  )
                }
              />
              <TextField
                fullWidth
                required
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{ color: themeColors.text.secondary }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ ...inputStyles, mb: 0 }}
                error={
                  !!(error && formData.password !== formData.confirmPassword)
                }
                helperText={
                  error && formData.password !== formData.confirmPassword
                    ? "Passwords don't match"
                    : ""
                }
              />
            </Stack>
          </Fade>
        );
      case 2:
        return (
          <Fade in={true} timeout={300} key="step2">
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: themeColors.text.primary, fontWeight: 600 }}
              >
                Confirm Your Details
              </Typography>
              <Box
                sx={{
                  mb: 3,
                  p: { xs: 2, sm: 3 },
                  backgroundColor: themeColors.background.page,
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border.main}`,
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: themeColors.text.secondary, mb: 1 }}
                >
                  <strong>Name:</strong> {formData.displayName || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: themeColors.text.secondary, mb: 1 }}
                >
                  <strong>Role:</strong>{" "}
                  {roles.find((r) => r.value === formData.role)?.label || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: themeColors.text.secondary, mb: 1 }}
                >
                  <strong>Email:</strong> {formData.email || "N/A"}
                </Typography>
                {formData.phone && (
                  <Typography
                    variant="body2"
                    sx={{ color: themeColors.text.secondary }}
                  >
                    <strong>Phone:</strong> {formData.phone}
                  </Typography>
                )}
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
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
                  "&:hover": {
                    backgroundColor: themeColors.primary.light,
                    boxShadow: "none",
                  },
                }}
              >
                {" "}
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Account"
                )}{" "}
              </Button>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: themeColors.background.page,
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: themeColors.background.paper,
          color: themeColors.text.primary,
          borderBottom: `1px solid ${themeColors.border.main}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Tech Transfer Office
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 1 } }}>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: "12px",
              border: `1px solid ${themeColors.border.main}`,
              overflow: "hidden",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                minHeight: 48,
                backgroundColor: themeColors.tab.background,
                "& .MuiTab-root": {
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  color: themeColors.tab.defaultText,
                  "&.Mui-selected": {
                    color: themeColors.tab.selectedText,
                    backgroundColor: themeColors.tab.selectedBackground,
                    fontWeight: 600,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: themeColors.primary.main,
                  height: "3px",
                },
              }}
            >
              <Tab label="Login" id="login-tab" aria-controls="login-panel" />
              <Tab
                label="Sign Up"
                id="signup-tab"
                aria-controls="signup-panel"
              />
            </Tabs>
          </Paper>

          {activeTab === 1 && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: "16px",
                border: `1px solid ${themeColors.border.main}`,
                backgroundColor: themeColors.background.paper,
              }}
              role="tabpanel"
              id="signup-panel"
              aria-labelledby="signup-tab"
            >
              <Box sx={{ mb: 2 }}>
                <Stepper
                  activeStep={currentStep}
                  sx={{
                    mb: 2.5,
                    "& .MuiStepIcon-root": {
                      color: themeColors.border.main,
                      "&.Mui-active": { color: themeColors.primary.main },
                      "&.Mui-completed": { color: themeColors.primary.main },
                    },
                  }}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                            color:
                              currentStep >= index
                                ? themeColors.text.primary
                                : themeColors.text.disabled,
                            "&.Mui-active": { fontWeight: 600 },
                            "&.Mui-completed": { fontWeight: 500 },
                          },
                        }}
                      >
                        {" "}
                        {!isMobile && label}{" "}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: themeColors.text.primary,
                    textAlign: "center",
                    mb: error ? 1.5 : 3,
                  }}
                >
                  {" "}
                  {steps[currentStep]}{" "}
                </Typography>
                {error && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ textAlign: "center", mb: 2 }}
                  >
                    {error}
                  </Typography>
                )}
              </Box>
              <Box
                component="form"
                onSubmit={
                  currentStep === steps.length - 1
                    ? handleSubmit
                    : (e) => {
                        e.preventDefault();
                        handleNext();
                      }
                }
              >
                {renderStepContent(currentStep)}
                {currentStep < steps.length - 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={currentStep === 0 || loading}
                      startIcon={<ArrowBack />}
                      sx={{
                        flex: 1,
                        borderColor: themeColors.border.main,
                        color: themeColors.primary.main,
                        textTransform: "none",
                        py: 1.2,
                        borderRadius: "8px",
                        "&:hover": {
                          borderColor: themeColors.primary.light,
                          backgroundColor: `${themeColors.primary.main}1A`,
                        },
                        "&:disabled": {
                          opacity: 0.5,
                          borderColor: themeColors.text.disabled,
                          color: themeColors.text.disabled,
                        },
                      }}
                    >
                      {" "}
                      Back{" "}
                    </Button>
                    <Button
                      variant="contained"
                      type="button"
                      onClick={handleNext}
                      disabled={loading}
                      endIcon={<ArrowForward />}
                      sx={{
                        flex: 1,
                        backgroundColor: themeColors.primary.main,
                        color: themeColors.primary.contrastText,
                        textTransform: "none",
                        py: 1.2,
                        borderRadius: "8px",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: themeColors.primary.light,
                        },
                      }}
                    >
                      {" "}
                      {loading && currentStep < steps.length - 1 ? (
                        <CircularProgress size={22} color="inherit" />
                      ) : (
                        "Next"
                      )}{" "}
                    </Button>
                  </Box>
                )}
              </Box>
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: themeColors.text.secondary,
                    fontSize: "0.875rem",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    onClick={() => {
                      setActiveTab(0);
                      setError("");
                      setCurrentStep(0);
                    }}
                    sx={{
                      color: themeColors.text.link,
                      textDecoration: "none",
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Paper>
          )}

          {activeTab === 0 && (
            <Box
              role="tabpanel"
              id="login-panel"
              aria-labelledby="login-tab"
              sx={{ width: "100%" }}
            >
              <Login
                switchToSignupTab={() => {
                  setActiveTab(1);
                  setError("");
                  setCurrentStep(0);
                }}
                themeColors={themeColors}
                inputStyles={inputStyles}
              />
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Signup;
