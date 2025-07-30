import React, { useEffect } from "react";
import {
  Box,
  Container,
  Chip,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowForward,
  FavoriteBorderOutlined,
  Language as LanguageIcon,
  Search,
  Book,
  People,
  ShieldOutlined,
  Bolt,
  Chat,
  Lock,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { homePageContent } from "../Home/homeContent";

const iconMap = {
  Bolt: Bolt,
  ShieldOutlined: ShieldOutlined,
  People: People,
  Book: Book,
  Chat: Chat,
  Search: Search,
};

const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, #1976D2 0%, #7B1FA2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 700,
  display: "inline",
}));

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  out: { opacity: 0 },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { makingImpact, hero } = homePageContent;
  const staticFeatures = [
    {
      iconName: "Bolt",
      title: "Rapid Insights",
      description:
        "Access and understand complex research findings quickly and efficiently through our summarized and curated content.",
      iconColor: "#D97706",
      bgColor: "#FEF3C7",
    },
    {
      iconName: "ShieldOutlined",
      title: "Verified & Secure",
      description:
        "Trust in a platform that prioritizes data integrity and provides a secure environment for anonymous contributions.",
      iconColor: "#059669",
      bgColor: "#D1FAE5",
    },
    {
      iconName: "People",
      title: "Community Driven",
      description:
        "Join a vibrant community of researchers, industry experts, and enthusiasts to foster collaboration and discussion.",
      iconColor: "#2563EB",
      bgColor: "#DBEAFE",
    },
    {
      iconName: "Book",
      title: "Knowledge Hub",
      description:
        "Explore a vast repository of research across various domains, all simplified for broader understanding and application.",
      iconColor: "#7C3AED",
      bgColor: "#EDE9FE",
    },
    {
      iconName: "Chat",
      title: "Engage & Discuss",
      description:
        "Participate in meaningful conversations, ask questions, and share perspectives on the latest research trends.",
      iconColor: "#DB2777",
      bgColor: "#FCE7F3",
    },
    {
      iconName: "Search",
      title: "Easy Discovery",
      description:
        "Our intuitive search and filtering tools help you find the exact research you need, when you need it.",
      iconColor: "#4F46E5",
      bgColor: "#E0E7FF",
    },
  ];

  const PrimaryButtonIcon = iconMap[hero.primaryButtonIconName] || ArrowForward;
  const SecondaryButtonIcon = iconMap[hero.secondaryButtonIconName] || Lock;

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
                icon={
                  <FavoriteBorderOutlined
                    sx={{ color: "#1e40af !important" }}
                  />
                }
                label="Our Core Values"
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
                About{" "}
                <GradientText component="span" sx={{ fontSize: "inherit" }}>
                  R2C
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
                  maxWidth: "700px",
                  mx: "auto",
                  px: { xs: "0 10px", sm: "0 20px" },
                }}
              >
                We're democratizing access to research by creating a platform
                where knowledge flows freely between researchers, industry, and
                the public.
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "white", py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              mx: "auto",
              width: "100%",
              maxWidth: "lg",
              "@media (min-width:900px) and (max-width:1400px)": {
                maxWidth: "md",
              },
            }}
          >
            <Box
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 5, md: 8 },
                alignItems: { md: "flex-start" },
              }}
            >
              <Box
                component={motion.div}
                variants={fadeInUpVariants}
                sx={{
                  flex: 1,
                  textAlign: { xs: "center", md: "left" },
                  position: { md: "sticky" },
                  top: { md: "120px" },
                  alignSelf: { md: "flex-start" },
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: "black",
                    mb: 2,
                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                  }}
                >
                  Our Mission
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#4B5563",
                    mb: 4,
                    lineHeight: 1.7,
                    fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  }}
                >
                  R2C (Research to Commercialization) was born from a simple
                  belief: groundbreaking research should be accessible to
                  everyone, not locked behind paywalls or buried in academic
                  jargon.
                  <br /> <br />
                  We're building bridges between the ivory tower and the real
                  world, enabling researchers to share their work anonymously
                  while empowering curious minds to explore, understand, and
                  engage with cutting-edge science.
                </Typography>
                <Link to="/studies" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForward sx={{ fontSize: "16px" }} />}
                    sx={{
                      bgcolor: "black",
                      "&:hover": { bgcolor: "#2F2F31" },
                      textTransform: "none",
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1 },
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      alignSelf: { xs: "center", md: "flex-start" },
                    }}
                  >
                    Explore Research
                  </Button>
                </Link>
              </Box>

              <Box
                component={motion.div}
                variants={fadeInUpVariants}
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  alignSelf: { xs: "auto", md: "stretch" },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minWidth: { sm: 300 },
                    maxWidth: { md: 500 },
                    p: { xs: 3, sm: 4 },
                    borderRadius: "16px",
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, #e0ecff 0%, #e6e0ff 100%)",
                  }}
                >
                  <LanguageIcon
                    sx={{
                      fontSize: { xs: 80, sm: 100 },
                      color: "#2563eb",
                      mb: 3,
                      alignSelf: "center",
                    }}
                  />
                  <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: "black",
                        mb: 2,
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      }}
                    >
                      Global Collaboration
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(72, 72, 72, 0.9)",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        lineHeight: 1.7,
                      }}
                    >
                      Connecting researchers, institutions, and enthusiasts from
                      every corner of the world, promoting diverse perspectives
                      and collaborative innovation for a better future.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "white", py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            sx={{ maxWidth: "xl", mx: "auto", width: "100%" }}
          >
            <Box textAlign="center" sx={{ mb: { xs: 5, sm: 6, md: 7 } }}>
              <motion.div variants={fadeInUpVariants}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
                    fontWeight: 700,
                    mb: 2.5,
                    color: "#1f2937",
                  }}
                >
                  Why Partner With R2C?
                </Typography>
              </motion.div>
              <motion.div variants={fadeInUpVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                    color: "#6b7280",
                    maxWidth: "700px",
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  Discover the unique advantages our platform offers to
                  researchers, industry professionals, and curious minds alike.
                </Typography>
              </motion.div>
            </Box>
            <Grid
              container
              component={motion.div}
              variants={containerVariants}
              spacing={{ xs: 2.5, sm: 3, md: 4 }}
              justifyContent="center"
            >
              {staticFeatures.map((feature, index) => {
                const IconComponent = iconMap[feature.iconName] || Search;
                return (
                  <Grid
                    item
                    component={motion.div}
                    variants={fadeInUpVariants}
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card
                      sx={{
                        width: "100%",
                        maxWidth: "400px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-6px) scale(1.015)",
                          boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                          "& .feature-icon-container": {
                            backgroundColor: feature.iconColor,
                            transform: "scale(1.08)",
                          },
                          "& .feature-icon": { color: "#ffffff !important" },
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: { xs: 2, sm: 2.5, md: 2.5 },
                          textAlign: "center",
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          className="feature-icon-container"
                          sx={{
                            width: { xs: 50, sm: 55, md: 60 },
                            height: { xs: 50, sm: 55, md: 60 },
                            borderRadius: "12px",
                            bgcolor: feature.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: { xs: 2, sm: 2.5 },
                            transition:
                              "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                          }}
                        >
                          <IconComponent
                            className="feature-icon"
                            sx={{
                              fontSize: { xs: 24, sm: 26, md: 28 },
                              color: feature.iconColor,
                              transition:
                                "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1.1rem",
                              md: "1.15rem",
                            },
                            fontWeight: 600,
                            mb: { xs: 1.5, sm: 1.5 },
                            color: "#1f2937",
                            lineHeight: 1.3,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.85rem",
                              md: "0.875rem",
                            },
                            color: "#4b5563",
                            lineHeight: 1.5,
                            flexGrow: 1,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "white", py: { xs: 1, sm: 1, md: 1 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            sx={{ maxWidth: "lg", mx: "auto", width: "100%" }}
          >
            <motion.div variants={fadeInUpVariants}>
              <Box textAlign="center" sx={{ mb: { xs: 4, md: 6 } }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
                    fontWeight: 700,
                    mb: 3.5,
                    color: "#1f2937",
                  }}
                >
                  Our Story
                </Typography>
              </Box>
            </motion.div>
            <motion.div variants={fadeInUpVariants}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.95rem", sm: "1rem", md: "1.2rem" },
                  color: "#4B5563",
                  lineHeight: 1.7,
                  maxWidth: "800px",
                  mx: "auto",
                  whiteSpace: "pre-line",
                  textAlign: "center",
                  mb: { xs: 4, md: 6 },
                }}
              >
                R2C was founded in 2023 by a team of researchers, technologists,
                and advocates who experienced firsthand the barriers that
                prevent groundbreaking research from reaching those who need it
                most. <br /> <br />
                We noticed that brilliant discoveries were often trapped in
                academic silos, accessible only to those with institutional
                subscriptions or specialized knowledge. Meanwhile, curious minds
                outside academia struggled to engage with cutting-edge research
                that could inform their decisions, spark innovation, or simply
                satisfy their intellectual curiosity. <br /> <br />
                Our platform represents a new paradigm: anonymous publishing
                that protects researchers while AI-powered tools make complex
                research accessible to everyone. We're not just sharing papers;
                we're creating conversations between researchers and the public
                that have never been possible before. <br /> <br />
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Box
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        sx={{
          background:
            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
          py: { xs: 6, sm: 8, md: 10 },
          px: 0,
          width: "100%",
          margin: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            filter: "blur(40px)",
            display: { xs: "none", md: "block" },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            bgcolor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "50%",
            filter: "blur(30px)",
            display: { xs: "none", md: "block" },
          }}
        />
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <motion.div variants={fadeInUpVariants}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                fontWeight: 700,
                color: "white",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {makingImpact.title}
            </Typography>
          </motion.div>
          <motion.div variants={fadeInUpVariants}>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                color: "rgba(255, 255, 255, 0.9)",
                mb: { xs: 4, sm: 5, md: 6 },
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              {makingImpact.subtitle}
            </Typography>
          </motion.div>
          <Grid
            container
            component={motion.div}
            variants={containerVariants}
            spacing={{ xs: 3, sm: 4, md: 6 }}
            justifyContent="center"
          >
            {makingImpact.stats.map((stat, index) => (
              <Grid
                item
                xs={6}
                sm={3}
                key={index}
                component={motion.div}
                variants={fadeInUpVariants}
              >
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                      fontWeight: 800,
                      color: "white",
                      mb: 1,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                      color: "rgba(255, 255, 255, 0.85)",
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "white", py: { xs: 1, sm: 1, md: 1 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            sx={{ maxWidth: "lg", mx: "auto", width: "100%" }}
          >
            <motion.div variants={fadeInUpVariants}>
              <Box
                textAlign="center"
                sx={{ mt: { xs: 4, sm: 6, md: 8 }, mb: { xs: 4, md: 6 } }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
                    fontWeight: 700,
                    mb: 3.5,
                    color: "#1f2937",
                  }}
                >
                  Join Our Mission
                </Typography>
              </Box>
            </motion.div>
            <motion.div variants={fadeInUpVariants}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.95rem", sm: "1rem", md: "1.2rem" },
                  color: "#4B5563",
                  lineHeight: 1.7,
                  maxWidth: "800px",
                  mx: "auto",
                  whiteSpace: "pre-line",
                  textAlign: "center",
                  mb: { xs: 4, md: 6 },
                }}
              >
                Whether you're a researcher looking to share your work or
                someone curious about the latest discoveries, there's a place
                for you in the R2C community.
              </Typography>
            </motion.div>
          </Box>

          <Stack
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUpVariants}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 6 }}
          >
            <Button
              component={Link}
              to={hero.primaryButtonLink}
              variant="contained"
              endIcon={<PrimaryButtonIcon />}
              sx={{
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 600,
                borderRadius: "12px",
                bgcolor: "#2563eb",
                color: "white",
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
                "&:hover": {
                  bgcolor: "#1d4ed8",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                },
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                width: { xs: "100%", sm: "auto" },
                maxWidth: { xs: "280px", sm: "none" },
              }}
            >
              {hero.primaryButtonText}
            </Button>
            <Button
              component={Link}
              to={hero.secondaryButtonLink}
              variant="outlined"
              startIcon={<SecondaryButtonIcon />}
              sx={{
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "12px",
                borderColor: "#d1d5db",
                color: "#374151",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#9ca3af",
                  bgcolor: "rgba(243, 244, 246, 0.5)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                },
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                width: { xs: "100%", sm: "auto" },
                maxWidth: { xs: "280px", sm: "none" },
              }}
            >
              {hero.secondaryButtonText}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
