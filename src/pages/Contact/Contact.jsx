import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Card,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ChatOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";

const ContactIconBox = styled(Box)(({ theme, bgcolor }) => ({
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: bgcolor,
  flexShrink: 0,
  "& .MuiSvgIcon-root": {
    fontSize: "22px",
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
    width: "40px",
    height: "40px",
    "& .MuiSvgIcon-root": {
      fontSize: "20px",
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    backgroundColor: "#F8FAFC",
    fontSize: "15px",
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
      padding: "13px 14px",
      fontSize: "15px",
    },
    "& textarea": {
      padding: "13px 14px",
      fontSize: "15px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#64748B",
    fontSize: "15px",
    "&.Mui-focused": {
      color: "#1976D2",
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: "6px",
  backgroundColor: "#F8FAFC",
  fontSize: "15px",
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
    padding: "13px 14px",
    fontSize: "15px",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1E293B",
  color: "white",
  padding: "13px 26px",
  borderRadius: "6px",
  fontWeight: 600,
  fontSize: "15px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#0F172A",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "13px 22px",
    fontSize: "15px",
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
  marginBottom: "8px",
  fontSize: "15px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
}));

const ContactInfoItem = ({ icon, bgColor, title, children }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
    <ContactIconBox bgcolor={bgColor} sx={{ mr: 2 }}>
      {icon}
    </ContactIconBox>
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: "#1E293B",
          fontSize: { xs: "1rem", md: "1.1rem" },
          mb: 0.75,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  </Box>
);

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.5 } },
  out: { opacity: 0 },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.category ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const GOOGLE_FORM_URL =
      "https://docs.google.com/forms/d/e/1FAIpQLSewkRtrflqC1x9QFKKpmte4Yk90f8rT6ON07sIAY3Nc6Hz9DQ/formResponse";

    const GOOGLE_FORM_ENTRIES = {
      email: "entry.2123290073",
      fullName: "entry.54957500",
      category: "entry.705842560",
      subject: "entry.1279401162",
      message: "entry.110051072",
    };

    const googleFormData = new FormData();
    googleFormData.append(GOOGLE_FORM_ENTRIES.fullName, formData.fullName);
    googleFormData.append(GOOGLE_FORM_ENTRIES.email, formData.email);
    googleFormData.append(GOOGLE_FORM_ENTRIES.category, formData.category);
    googleFormData.append(GOOGLE_FORM_ENTRIES.subject, formData.subject);
    googleFormData.append(GOOGLE_FORM_ENTRIES.message, formData.message);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        body: googleFormData,
        mode: "no-cors",
      });

      alert("Message sent successfully!");
      setFormData({
        fullName: "",
        email: "",
        category: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert(
        "An error occurred while sending your message. Please try again later."
      );
    }
  };

  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
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
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              textAlign: "center",
              maxWidth: "800px",
              mx: "auto",
              p: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <motion.div variants={fadeInUpVariants}>
              <Chip
                icon={<ChatOutlined sx={{ color: "#1e40af !important" }} />}
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
            </motion.div>
            <motion.div variants={fadeInUpVariants}>
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
            </motion.div>
            <motion.div variants={fadeInUpVariants}>
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
                Have questions about R2C.ai? Need support with your research? We'd
                love to hear from you.
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "white", py: { xs: 5, sm: 6, md: 8 } }}>
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: "26px", sm: "32px", md: "100px" },
            pr: { md: "90px" },
          }}
        >
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 5, md: 8 },
            }}
          >
            <Box
              component={motion.div}
              variants={fadeInUpVariants}
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 40%" },
                maxWidth: { xs: "100%", md: "40%" },
                display: "flex",
                flexDirection: "column",
                paddingTop: { xs: 3, sm: 3.5, md: 2.5 },
                position: { md: "sticky" },
                top: { md: "120px" },
                alignSelf: { md: "flex-start" },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  fontWeight: 700,
                  color: "#1E293B",
                  mb: { xs: 2, md: 2.5 },
                }}
              >
                Contact Information
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  color: "#64748B",
                  mb: { xs: 3, md: 4 },
                  lineHeight: 1.6,
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    mb: 0.5,
                  }}
                >
                  sidhant21495@iiitd.ac.in
                </Typography>
                <Typography
                  sx={{
                    color: "#1976D2",
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    mb: 0.5,
                  }}
                >
                  mohit21542@iiitd.ac.in
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
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
{/*                 <Typography
                  sx={{
                    color: "#1E293B",
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    mb: 0.5,
                  }}
                >
                  +91 97112 32008
                </Typography> */}
{/*                 <Typography
                  sx={{
                    color: "#1E293B",
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    mb: 0.5,
                  }}
                >
                  +91 88512 28350
                </Typography> */}
                // <Typography
                //   sx={{
                //     color: "#64748B",
                //     fontSize: { xs: "0.85rem", md: "0.9rem" },
                //   }}
                // >
                //   Mon-Fri, 10AM-7PM IST
                // </Typography>
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    mb: 0.5,
                  }}
                >
                 Indraprastha Institute of Information Technology Delhi
                </Typography>
                
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                  }}
                >
                  Delhi, 110020, India
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    mb: 0.5,
                  }}
                >
                  Monday - Friday: 10:00 AM - 7:00 PM IST
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                    mb: 0.5,
                  }}
                >
                  Saturday: 11:00 AM - 5:00 PM IST
                </Typography>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                  }}
                >
                  Sunday: Closed
                </Typography>
              </ContactInfoItem>
            </Box>

            <Box
              component={motion.div}
              variants={fadeInUpVariants}
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 60%" },
                maxWidth: { xs: "100%", md: "60%" },
              }}
            >
              <Card
                sx={{
                  paddingLeft: { xs: 3, sm: 3.5, md: 4.5 },
                  paddingRight: { xs: 3, sm: 3.5, md: 4.5 },
                  paddingBottom: { xs: 3, sm: 3.5, md: 4.5 },
                  paddingTop: { xs: 3, sm: 3.5, md: 2.5 },
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    fontWeight: 700,
                    color: "#1E293B",
                    mb: { xs: 2, md: 2.5 },
                  }}
                >
                  Send us a Message
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    color: "#64748B",
                    mb: { xs: 3, md: 4 },
                    lineHeight: 1.6,
                  }}
                >
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Box sx={{ mb: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2.5,
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
                  <Box sx={{ mb: 2.5 }}>
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
                          sx={{ fontSize: "15px", color: "#9CA3AF" }}
                        >
                          Select a category
                        </MenuItem>
                        <MenuItem
                          value="General Inquiry"
                          sx={{ fontSize: "15px" }}
                        >
                          General Inquiry
                        </MenuItem>
                        <MenuItem
                          value="Technical Support"
                          sx={{ fontSize: "15px" }}
                        >
                          Technical Support
                        </MenuItem>
                        <MenuItem value="Partnership" sx={{ fontSize: "15px" }}>
                          Partnership
                        </MenuItem>
                        <MenuItem
                          value="Research Collaboration"
                          sx={{ fontSize: "15px" }}
                        >
                          Research Collaboration
                        </MenuItem>
                        <MenuItem value="Other" sx={{ fontSize: "15px" }}>
                          Other
                        </MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Box>
                  <Box sx={{ mb: 2.5 }}>
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
                  <Box sx={{ mb: 2.5 }}>
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
                      inputProps={{ minLength: 10 }}
                      required
                    />
                    <Typography
                      sx={{ fontSize: "0.85rem", color: "#64748B", mt: 0.75 }}
                    >
                      Minimum 10 characters required
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 0 }}>
                    <SubmitButton
                      type="submit"
                      fullWidth
                      startIcon={<SendIcon />}
                      size="large"
                    >
                      Send Message
                    </SubmitButton>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;

