import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Divider,
  Container,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress, 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../src/AuthContext"; 

import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

const navItemSharedSxConfig = {
  defaultColor: "#666666",
  hoverColor: "black",
  activeColor: "#2563EB",
  textTransform: "none",
  fontWeight: "500",
  padding: "10px 18px",
  borderRadius: "7px",
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { currentUser, logout, loadingAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    try {
      await logout(); 
      if (isMobile && mobileOpen) {
        handleDrawerToggle();
      }
      navigate("/"); 
    } catch (error) {
      console.error("Error logging out from Header:", error);
    }
  };

  const navItems = [
    {
      id: "explore",
      label: "Explore Studies",
      path: "/studies",
      variant: "text",
      sxConfig: navItemSharedSxConfig,
    },
    {
      id: "about",
      label: "About",
      path: "/about",
      variant: "text",
      sxConfig: navItemSharedSxConfig,
    },
    {
      id: "contact",
      label: "Contact",
      path: "/contact",
      variant: "text",
      sxConfig: navItemSharedSxConfig,
    },
  ];

  const commonButtonStyles = {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          justifyContent: "space-between",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            my: 0.5,
            fontWeight: "bold",
            fontSize: "1rem",
            color: theme.palette.primary.main,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Menu
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          aria-label="close drawer"
          sx={{ padding: "8px" }}
        >
          <ChevronRightIcon sx={{ fontSize: "22px" }} />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ padding: "12px 8px" }}>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ marginBottom: "6px" }}>
            <ListItemButton
              component={item.id === "explore" ? RouterLink : NavLink}
              to={item.path}
              end={
                item.path === "/" || item.path === "/studies" ? undefined : true
              }
              onClick={handleDrawerToggle}
              disableRipple={true}
              sx={({ isActive } = { isActive: false }) => {
                /* Assuming NavLink passes isActive */
                const baseListItemStyles = {
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontFamily:
                    '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  textDecoration: "none",
                  transition:
                    "color 0.2s ease-in-out, background-color 0.2s ease-in-out",
                  backgroundColor: "transparent",
                };
                const config = item.sxConfig;
                const isItemActive = !!isActive;
                let currentTextColor = config.defaultColor;
                if (isItemActive) {
                  currentTextColor = config.activeColor;
                }
                return {
                  ...baseListItemStyles,
                  color: currentTextColor,
                  "& .MuiListItemText-primary": {
                    color: currentTextColor,
                    fontWeight: config.fontWeight || "500",
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: config.hoverColor,
                    "& .MuiListItemText-primary": {
                      color: config.hoverColor,
                    },
                  },
                };
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontFamily:
                    '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: "0.875rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {loadingAuth ? (
          <ListItem disablePadding sx={{ justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </ListItem>
        ) : !currentUser ? (
          <ListItem disablePadding sx={{ marginBottom: "6px" }}>
            <ListItemButton
              component={RouterLink}
              to="/signup" 
              onClick={handleDrawerToggle}
              sx={{
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: "10px",
                fontFamily:
                  '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                textDecoration: "none",
                transition:
                  "color 0.2s ease-in-out, background-color 0.2s ease-in-out",
                backgroundColor: "#2563EB",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1D4ED8",
                  color: "white",
                },
                "& .MuiListItemText-primary": {
                  color: "white",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                },
                "& .MuiListItemIcon-root": {
                  color: "white",
                  minWidth: "36px",
                },
              }}
            >
              <ListItemIcon>
                <LoginIcon fontSize="small" sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Login / Sign Up" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <Divider sx={{ marginY: "12px" }} />
            {[
              {
                label: "Dashboard",
                path: "/dashboard",
                icon: <DashboardIcon fontSize="small" />,
              },
            ].map((profileItem) => (
              <ListItem
                key={profileItem.label}
                disablePadding
                sx={{ marginBottom: "6px" }}
              >
                <ListItemButton
                  component={RouterLink}
                  to={profileItem.path}
                  onClick={handleDrawerToggle}
                  sx={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    fontFamily:
                      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.text.primary,
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                      minWidth: "36px",
                    },
                  }}
                >
                  <ListItemIcon>{profileItem.icon}</ListItemIcon>
                  <ListItemText primary={profileItem.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ marginBottom: "6px" }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontFamily:
                    '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: theme.palette.error.main,
                  "&:hover": {
                    color: theme.palette.error.dark,
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                  "& .MuiListItemText-primary": {
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "inherit",
                    minWidth: "36px",
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "0px 0.5px 0.5px rgba(0, 0, 0, 0.04)",
          zIndex: theme.zIndex.appBar,
          borderBottom: "0.5px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            paddingLeft: { xs: "26px", sm: "32px", md: "70px" },
            paddingRight: { xs: "26px", sm: "32px", md: "70px" },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              minHeight: { xs: "64px", sm: "68px" },
              paddingY: { xs: "4px", sm: "6px" },
            }}
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <Typography
                variant="h1"
                component="div"
                sx={{
                  color: "#1a1a1a",
                  fontWeight: "900",
                  fontFamily:
                    '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: "1.15rem", sm: "1.25rem", md: "1.3rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                Research to Commercialization
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  color: "#2563EB",
                  padding: "12px",
                  "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.08)" },
                }}
              >
                <MenuIcon sx={{ fontSize: "26px" }} />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {navItems.map((item) => {
                  const config = item.sxConfig;
                  return (
                    <Button
                      key={item.id}
                      component={item.id === "explore" ? RouterLink : NavLink}
                      to={item.path}
                      end={
                        item.path === "/" || item.path === "/studies"
                          ? undefined
                          : true
                      }
                      variant={item.variant}
                      disableRipple={true}
                      sx={({ isActive } = { isActive: false }) => {
                        /* Assuming NavLink passes isActive */
                        let currentTextColor = config.defaultColor;
                        if (isActive) {
                          currentTextColor = config.activeColor;
                        }
                        return {
                          ...commonButtonStyles,
                          padding: config.padding,
                          borderRadius: config.borderRadius,
                          textTransform: config.textTransform,
                          fontWeight: config.fontWeight,
                          color: currentTextColor,
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: config.hoverColor,
                          },
                        };
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
                {/* Conditional rendering based on auth state from context */}
                {loadingAuth ? (
                  <CircularProgress size={24} sx={{ color: "#2563EB" }} />
                ) : !currentUser ? (
                  (() => {
                    const loginItemConfig = {
                      id: "login",
                      label: "Login / Sign Up",
                      path: "/signup",
                      variant: "contained",
                      sx: {
                        backgroundColor: "#2563EB",
                        color: "white",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#1D4ED8",
                          boxShadow: "none",
                        },
                        textTransform: "none",
                        padding: "10px 20px",
                        borderRadius: "7px",
                      },
                    };
                    return (
                      <Button
                        key={loginItemConfig.id}
                        component={RouterLink}
                        to={loginItemConfig.path}
                        variant={loginItemConfig.variant}
                        sx={{
                          ...commonButtonStyles,
                          ...loginItemConfig.sx,
                        }}
                      >
                        {loginItemConfig.label}
                      </Button>
                    );
                  })()
                ) : (
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      color: "#4B5563",
                      padding: "8px",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                    }}
                    aria-controls={profileMenuOpen ? "profile-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={profileMenuOpen ? "true" : undefined}
                    id="profile-icon-button"
                  >
                    {currentUser.photoURL ? (
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || "User"}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ fontSize: "28px" }} />
                    )}
                  </IconButton>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "max(250px, 70vw)",
              maxWidth: "320px",
              borderTopLeftRadius: "16px",
              borderBottomLeftRadius: "16px",
              boxShadow: theme.shadows[3],
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
        MenuListProps={{ "aria-labelledby": "profile-icon-button" }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 1px 4px rgba(0,0,0,0.1))",
            mt: 1.5,
            minWidth: 200,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderTop: `1px solid ${theme.palette.divider}`,
              borderLeft: `1px solid ${theme.palette.divider}`,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Display user info if available */}
        {currentUser && (
          <MenuItem
            disabled
            sx={{
              fontSize: "0.8rem",
              py: 0.5,
              color: theme.palette.text.secondary,
              fontWeight: 500,
              "&.Mui-disabled": { opacity: 1 },
            }}
          >
            {currentUser?.displayName || currentUser?.email}
          </MenuItem>
        )}
        {currentUser && <Divider sx={{ mb: 0.5 }} />}
        <MenuItem
          component={RouterLink}
          to="/dashboard"
          onClick={handleProfileMenuClose}
          sx={{ fontSize: "0.9rem", py: 1.25 }}
        >
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ fontSize: "0.9rem", py: 1.25, color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <LogoutIcon
              fontSize="small"
              sx={{ color: theme.palette.error.main }}
            />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
