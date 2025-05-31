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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link as RouterLink, NavLink } from 'react-router-dom';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    {
      id: "explore",
      label: "Explore Studies",
      path: "/studies",
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
      }
    },
    {
      id: "login",
      label: "Login / Sign Up",
      path: "/login",
      variant: "text",
      // Base styles for this item, primarily for desktop Button state reference
      // The sx prop in the component will dynamically build the final style
      sxConfig: { // Renamed to sxConfig to avoid confusion if item.sx was directly used
        defaultColor: "#666666",
        hoverColor: "black",
        activeColor: "#2563EB",
        textTransform: "none",
        fontWeight: "500",
        padding: "10px 18px", // Desktop button padding
        borderRadius: "7px",   // Desktop button border radius
      },
    },
    {
      id: "dashboard",
      label: "Researcher Dashboard",
      path: "/dashboard",
      variant: "text",
      sxConfig: {
        defaultColor: "#666666",
        hoverColor: "black",
        activeColor: "#2563EB",
        textTransform: "none",
        fontWeight: "500",
        padding: "10px 18px",
        borderRadius: "7px",
      },
    },
    {
      id: "about",
      label: "About",
      path: "/about",
      variant: "text",
      sxConfig: {
        defaultColor: "#666666",
        hoverColor: "black",
        activeColor: "#2563EB",
        textTransform: "none",
        fontWeight: "500",
        padding: "10px 18px",
        borderRadius: "7px",
      },
    },
    {
      id: "contact",
      label: "Contact",
      path: "/contact",
      variant: "text",
      sxConfig: {
        defaultColor: "#666666",
        hoverColor: "black",
        activeColor: "#2563EB",
        textTransform: "none",
        fontWeight: "500",
        padding: "10px 18px",
        borderRadius: "7px",
      },
    },
  ];

  const commonButtonStyles = { // For desktop buttons
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: "0.9rem",
    backgroundColor: 'transparent',
    transition: "color 0.2s ease-in-out, background-color 0.2s ease-in-out",
    textDecoration: 'none',
    // Note: padding & borderRadius will be taken from item.sxConfig for desktop buttons
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
        <IconButton onClick={handleDrawerToggle} aria-label="close drawer" sx={{ padding: "8px" }}>
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
              end={item.path === "/" || item.path === "/studies" || item.id === "explore" ? undefined : true} // More precise `end` for NavLink
              onClick={handleDrawerToggle}
              disableRipple={item.id !== "explore"}
              sx={({ isActive } = { isActive: false }) => {
                const baseListItemStyles = {
                  textAlign: "left",
                  padding: "10px 12px", // Drawer specific padding
                  borderRadius: "10px",  // Drawer specific borderRadius
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  textDecoration: 'none',
                  transition: "color 0.2s ease-in-out, background-color 0.2s ease-in-out",
                  backgroundColor: 'transparent',
                };

                if (item.id === "explore") {
                  return {
                    ...baseListItemStyles,
                    backgroundColor: item.sx.backgroundColor, // from explore's original sx
                    color: item.sx.color,
                    "&:hover": {
                      backgroundColor: item.sx["&:hover"]?.backgroundColor || item.sx.backgroundColor,
                    },
                    "& .MuiListItemText-primary, & .MuiListItemIcon-root": {
                       color: item.sx.color,
                    },
                  };
                } else { // Non-explore items in drawer
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
                    "& .MuiListItemIcon-root": {
                      color: currentTextColor,
                    },
                    "&:hover": {
                      backgroundColor: 'transparent',
                      color: config.hoverColor,
                      "& .MuiListItemText-primary": {
                        color: config.hoverColor,
                      },
                      "& .MuiListItemIcon-root": {
                        color: config.hoverColor,
                      },
                    },
                  };
                }
              }}
            >
              {item.icon && ( // item.icon is currently not defined in navItems
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: "18px" } })}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: "0.875rem",
                  // fontWeight is handled by the sx prop on ListItemButton targeting .MuiListItemText-primary
                }}
                sx={{ marginLeft: item.icon ? 0 : "0px" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar /* ... AppBar props ... */ 
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "0px 0.5px 0.5px rgba(0, 0, 0, 0.04)",
          zIndex: theme.zIndex.appBar,
          borderBottom: "0.5px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Container /* ... Container props ... */
          maxWidth="xl"
          sx={{
            paddingLeft: { xs: "26px", sm: "32px", md: "70px" },
            paddingRight: { xs: "26px", sm: "32px", md: "70px" },
          }}
        >
          <Toolbar /* ... Toolbar props ... */
            disableGutters
            sx={{
              justifyContent: "space-between",
              minHeight: { xs: "64px", sm: "68px" },
              paddingY: { xs: "4px", sm: "6px" },
            }}
          >
            <Box /* ... Logo Box props ... */
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <Typography /* ... Logo Typography props ... */
                variant="h1"
                component="div"
                sx={{
                  color: "#1a1a1a",
                  fontWeight: "900",
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: "1.15rem", sm: "1.25rem", md: "1.3rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                Tech Transfer Office
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton /* ... Mobile Menu IconButton ... */
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  color: "#2563EB",
                  padding: "12px",
                  "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                  }
                }}
              >
                <MenuIcon sx={{ fontSize: "26px" }} />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {navItems.map((item) => {
                  if (item.id === "explore") {
                    return ( // Explore button for desktop
                      <Button
                        key={item.id}
                        component={RouterLink}
                        to={item.path}
                        variant={item.variant}
                        startIcon={item.icon} // item.icon is currently undefined
                        sx={{ // sx prop correctly assigned an object
                          ...commonButtonStyles,
                          ...item.sx, // Original sx for explore button
                        }}
                      >
                        {item.label} {/* Child is a string */}
                      </Button>
                    );
                  } else { // Non-explore buttons for desktop
                    const config = item.sxConfig;
                    return (
                      <Button
                        key={item.id}
                        component={NavLink}
                        to={item.path}
                        end={item.path === "/"} // `end` prop for NavLink
                        variant={item.variant}
                        disableRipple={true}
                        startIcon={item.icon} // item.icon is currently undefined
                        sx={({ isActive }) => { // sx prop correctly assigned a function returning an object
                          let currentTextColor = config.defaultColor;
                          if (isActive) {
                            currentTextColor = config.activeColor;
                          }
                          return { // This is the style object being returned
                            ...commonButtonStyles, // Spread common styles
                            padding: config.padding, // Specific padding from sxConfig
                            borderRadius: config.borderRadius, // Specific borderRadius from sxConfig
                            textTransform: config.textTransform,
                            fontWeight: config.fontWeight,
                            color: currentTextColor,
                            "&:hover": {
                              backgroundColor: 'transparent', // from commonButtonStyles or explicit
                              color: config.hoverColor,
                            },
                          };
                        }}
                      >
                        {item.label} {/* Child is a string */}
                      </Button>
                    );
                  }
                })}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <nav>
        <Drawer /* ... Drawer props ... */
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "10vw",
              minWidth: "220px",
              borderRadius: "16px 0 0 16px",
            },
          }}
        >
          {drawer} {/* `drawer` variable holds JSX, should be fine */}
        </Drawer>
      </nav>
    </>
  );
};

export default Header;