import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  useTheme,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Chat } from "@mui/icons-material";

const ContactIconBox = styled(Box)(({ theme, bgcolor }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: bgcolor,
  flexShrink: 0,
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
    color:
      bgcolor === "#E3F2FD"
        ? "#1976D2"
        : bgcolor === "#F3E5F5"
        ? "#7B1FA2"
        : bgcolor === "#E8F5E8"
        ? "#2E7D32"
        : "#FF6F00",
  },
  [theme.breakpoints.down("sm")]: {
    width: "36px",
    height: "36px",
    "& .MuiSvgIcon-root": {
      fontSize: "18px",
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    backgroundColor: "#F8FAFC",
    fontSize: "14px",
    "& fieldset": {
      borderColor: "#E2E8F0",
    },
    "&:hover fieldset": {
      borderColor: "#CBD5E0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976D2",
    },
    "& input": {
      padding: "12px 14px",
      fontSize: "14px",
    },
    "& textarea": {
      padding: "12px 14px",
      fontSize: "14px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#64748B",
    fontSize: "14px",
    "&.Mui-focused": {
      color: "#1976D2",
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: "6px",
  backgroundColor: "#F8FAFC",
  fontSize: "14px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E2E8F0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#CBD5E0",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1976D2",
  },
  "& .MuiSelect-select": {
    padding: "12px 14px",
    fontSize: "14px",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1E293B",
  color: "white",
  padding: "12px 24px",
  borderRadius: "6px",
  fontWeight: 600,
  fontSize: "14px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#0F172A",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "12px 20px",
    fontSize: "14px",
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, #1976D2 0%, #7B1FA2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 700,
  display: "inline",
}));

const FormFieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "#1E293B",
  marginBottom: "6px",
  fontSize: "14px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
  },
}));

const ContactInfoItem = ({ icon, bgColor, title, children }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2.5 }}>
    <ContactIconBox bgcolor={bgColor} sx={{ mr: 1.5 }}>
      {icon}
    </ContactIconBox>
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: "#1E293B",
          fontSize: { xs: "0.95rem", md: "1rem" },
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  </Box>
);

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recipientEmail: "anishdewat@gmail.com",
        }),
      });
      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          fullName: "",
          email: "",
          category: "",
          subject: "",
          message: "",
        });
      } else {
        alert(
          `Failed to send message. Server responded with: ${response.statusText}. Please try again later.`
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert(
        "An error occurred while sending the message. Please try again later."
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "40vh",
          background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          pt: { xs: "80px", sm: "100px", md: "120px" },
          pb: { xs: "60px", sm: "80px", md: "100px" },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: "center",
              maxWidth: "800px",
              mx: "auto",
              p: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box sx={{ mb: { xs: 2, sm: 3, md: 3 } }}>
              <Chip
                icon={<Chat sx={{ color: "#1e40af !important" }} />}
                label="We're Here to Help"
                sx={{
                  mb: 3,
                  bgcolor: "#dbeafe",
                  color: "#1e40af",
                  fontWeight: 600,
                  px: 2,
                  py: 1.5,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  height: "auto",
                  "& .MuiChip-label": { py: 0.5 },
                  "& .MuiChip-icon": { color: "#1e40af" },
                }}
              />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                  lg: "3.5rem",
                },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: { xs: 2, sm: 3, md: 4 },
                color: "#1E293B",
              }}
            >
              Get in{" "}
              <GradientText component="span" sx={{ fontSize: "inherit" }}>
                Touch
              </GradientText>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                fontWeight: 400,
                color: "#64748B",
                lineHeight: 1.6,
                maxWidth: "600px",
                mx: "auto",
                px: { xs: "0 10px", sm: "0 20px" },
              }}
            >
              Have questions about TTO? Need support with your research? We'd
              love to hear from you.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "white", py: { xs: 4, sm: 5, md: 6 } }}>
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: "26px", sm: "32px", md: "100px" },
            pr: { md: "90px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: 8 },
            }}
          >
            <Box
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 40%" },
                maxWidth: { xs: "100%", md: "40%" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
                  fontWeight: 700,
                  color: "#1E293B",
                  mb: { xs: 1.5, md: 2 },
                }}
              >
                Contact Information
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  color: "#64748B",
                  mb: { xs: 2.5, md: 3 },
                  lineHeight: 1.5,
                }}
              >
                Reach out to us through any of these channels. We're committed
                to responding within 24 hours.
              </Typography>

              <ContactInfoItem
                icon={<EmailIcon />}
                bgColor="#E3F2FD"
                title="Email"
              >
                <Typography
                  sx={{
                    color: "#1976D2",
                    fontWeight: 500,
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                    mb: 0.25,
                  }}
                >
                  support@tto-platform.com
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                  }}
                >
                  We'll respond within 24 hours
                </Typography>
              </ContactInfoItem>

              <ContactInfoItem
                icon={<PhoneIcon />}
                bgColor="#F3E5F5"
                title="Phone"
              >
                <Typography
                  sx={{
                    color: "#1E293B",
                    fontWeight: 500,
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                    mb: 0.25,
                  }}
                >
                  +1 (555) 123-4567
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                  }}
                >
                  Mon-Fri, 9AM-6PM EST
                </Typography>
              </ContactInfoItem>

              <ContactInfoItem
                icon={<LocationOnIcon />}
                bgColor="#E8F5E8"
                title="Office"
              >
                <Typography
                  sx={{
                    color: "#1E293B",
                    fontWeight: 500,
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                    mb: 0.25,
                  }}
                >
                  123 Research Drive
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                    mb: 0.25,
                  }}
                >
                  Innovation District
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                  }}
                >
                  San Francisco, CA 94105
                </Typography>
              </ContactInfoItem>

              <ContactInfoItem
                icon={<AccessTimeIcon />}
                bgColor="#FFF3E0"
                title="Business Hours"
              >
                <Typography
                  sx={{
                    color: "#1E293B",
                    fontWeight: 500,
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                    mb: 0.25,
                  }}
                >
                  Monday - Friday: 9:00 AM - 6:00 PM EST
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                    mb: 0.25,
                  }}
                >
                  Saturday: 10:00 AM - 4:00 PM EST
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                  }}
                >
                  Sunday: Closed
                </Typography>
              </ContactInfoItem>
            </Box>

            <Card
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 60%" },
                maxWidth: { xs: "100%", md: "60%" },
                p: { xs: 3, md: 4 },
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
                  fontWeight: 700,
                  color: "#1E293B",
                  mb: { xs: 1.5, md: 2 },
                }}
              >
                Send us a Message
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  color: "#64748B",
                  mb: { xs: 2.5, md: 3 },
                  lineHeight: 1.5,
                }}
              >
                Fill out the form below and we'll get back to you as soon as
                possible.
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 50%" } }}>
                      <FormFieldLabel>
                        Full Name <span style={{ color: "#EF4444" }}>*</span>
                      </FormFieldLabel>
                      <StyledTextField
                        fullWidth
                        name="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        required
                      />
                    </Box>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 50%" } }}>
                      <FormFieldLabel>
                        Email Address{" "}
                        <span style={{ color: "#EF4444" }}>*</span>
                      </FormFieldLabel>
                      <StyledTextField
                        fullWidth
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        required
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <FormFieldLabel>
                    Category <span style={{ color: "#EF4444" }}>*</span>
                  </FormFieldLabel>
                  <FormControl fullWidth>
                    <StyledSelect
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      displayEmpty
                      IconComponent={KeyboardArrowDownIcon}
                      size="small"
                      required
                    >
                      <MenuItem
                        value=""
                        disabled
                        sx={{ fontSize: "14px", color: "#9CA3AF" }}
                      >
                        Select a category
                      </MenuItem>
                      <MenuItem value="general" sx={{ fontSize: "14px" }}>
                        General Inquiry
                      </MenuItem>
                      <MenuItem value="support" sx={{ fontSize: "14px" }}>
                        Technical Support
                      </MenuItem>
                      <MenuItem value="partnership" sx={{ fontSize: "14px" }}>
                        Partnership
                      </MenuItem>
                      <MenuItem value="research" sx={{ fontSize: "14px" }}>
                        Research Collaboration
                      </MenuItem>
                      <MenuItem value="other" sx={{ fontSize: "14px" }}>
                        Other
                      </MenuItem>
                    </StyledSelect>
                  </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <FormFieldLabel>
                    Subject <span style={{ color: "#EF4444" }}>*</span>
                  </FormFieldLabel>
                  <StyledTextField
                    fullWidth
                    name="subject"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    required
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <FormFieldLabel>
                    Message <span style={{ color: "#EF4444" }}>*</span>
                  </FormFieldLabel>
                  <StyledTextField
                    fullWidth
                    name="message"
                    multiline
                    rows={4}
                    placeholder="Please provide details about your inquiry..."
                    value={formData.message}
                    onChange={handleInputChange}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        "&::placeholder": { textIndent: "4px" },
                        paddingLeft: "4px",
                      },
                    }}
                    inputProps={{ minLength: 10 }}
                    required
                  />
                  <Typography
                    sx={{ fontSize: "0.75rem", color: "#64748B", mt: 0.5 }}
                  >
                    Minimum 10 characters required
                  </Typography>
                </Box>
                <Box sx={{ mb: 0 }}>
                  <SubmitButton
                    type="submit"
                    fullWidth
                    startIcon={<SendIcon />}
                    size="medium"
                  >
                    Send Message
                  </SubmitButton>
                </Box>
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Contact;
