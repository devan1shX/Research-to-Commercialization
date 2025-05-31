import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  useTheme,
  Stack,
  keyframes,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Bolt,
  ArrowForward,
  Lock,
  People,
  Book,
  ChatBubble,
  Search,
  Chat,
  ShieldOutlined
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { homePageContent } from './homeContent';

const pulse = keyframes`
  0%, 100% {
    opacity: 0.05;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.1;
    transform: scale(1.05);
  }
`;

const iconMap = {
  Bolt: Bolt,
  ArrowForward: ArrowForward,
  Lock: Lock,
  People: People,
  Book: Book,
  ChatBubble: ChatBubble,
  Search: Search,
  Chat: Chat,
  ShieldOutlined: ShieldOutlined,
};

const circleSizes = {
  xs: 56,
  sm: 60,
  md: 64,
};
const circleMb = { xs: 2, sm: 2.5 };

const Home = () => {
  const theme = useTheme();
  const { hero, whyChooseTTO, makingImpact, howItWorks } = homePageContent;

  const HeroChipIcon = iconMap[hero.chipIconName] || Bolt;
  const HeroPrimaryButtonIcon = iconMap[hero.primaryButtonIconName] || ArrowForward;
  const HeroSecondaryButtonIcon = iconMap[hero.secondaryButtonIconName] || Lock;

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: { xs: 180, sm: 200, md: 300 },
            height: { xs: 180, sm: 200, md: 300 },
            bgcolor: '#2563eb',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: `${pulse} 4s ease-in-out infinite alternate`
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 10,
            pt: { xs: 12, sm: 10, md: 10 },
            pb: { xs: 8, sm: 10, md: 10 }
          }}
        >
          <Box textAlign="center">
            <Chip
              icon={<HeroChipIcon sx={{ color: '#1e40af !important' }} />}
              label={hero.chipLabel}
              sx={{
                mb: 3,
                bgcolor: '#dbeafe',
                color: '#1e40af',
                fontWeight: 600,
                px: 2,
                py: 1.5,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                height: 'auto',
                '& .MuiChip-label': {
                  py: 0.5
                },
                '& .MuiChip-icon': {
                  color: '#1e40af',
                }
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.75rem', lg: '4.5rem' },
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.1,
                color: '#111827'
              }}
            >
              {hero.titlePart1}{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}
              >
                {hero.titleGradientPart}
              </Box>
            </Typography>
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: '#4b5563',
                mb: 5,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
                px: { xs: 1, sm: 0 }
              }}
            >
              {hero.description}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 6 }}
            >
              <Button
                component={Link}
                to={hero.primaryButtonLink}
                variant="contained"
                endIcon={<HeroPrimaryButtonIcon />}
                sx={{
                  px: { xs: 2.5, sm: 3.5 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  borderRadius: '12px',
                  bgcolor: '#2563eb',
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                  '&:hover': {
                    bgcolor: '#1d4ed8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(37, 99, 235, 0.35)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  width: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '280px', sm: 'none' }
                }}
              >
                {hero.primaryButtonText}
              </Button>
              <Button
                component={Link}
                to={hero.secondaryButtonLink}
                variant="outlined"
                startIcon={<HeroSecondaryButtonIcon />}
                sx={{
                  px: { xs: 2.5, sm: 3.5 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '12px',
                  borderColor: '#d1d5db',
                  color: '#374151',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#9ca3af',
                    bgcolor: 'rgba(243, 244, 246, 0.5)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  width: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '280px', sm: 'none' }
                }}
              >
                {hero.secondaryButtonText}
              </Button>
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 3 }}
              justifyContent="center"
              alignItems="center"
              sx={{ color: '#4b5563', fontSize: '0.9rem' }}
            >
              {hero.stats.map((stat, index) => {
                const StatIcon = iconMap[stat.iconName] || People;
                return (
                  <Box key={index} display="flex" alignItems="center" gap={0.75}>
                    <StatIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{stat.text}</Typography>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          pt: { xs: 6, sm: 8, md: 10 },
          pb: { xs: 8, sm: 10, md: 12 },
          bgcolor: '#ffffff',
          position: 'relative'
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: 0,
            paddingLeft: { xs: '26px', sm: '32px', md: '70px' },
            paddingRight: { xs: '26px', sm: '32px', md: '70px' },
          }}
        >
          <Box textAlign="center" sx={{ mb: { xs: 4, sm: 6, md: 7 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem' },
                fontWeight: 700,
                mb: 2.5,
                color: '#1f2937'
              }}
            >
              {whyChooseTTO.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                color: '#6b7280',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              {whyChooseTTO.subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2.5, sm: 3, md: 3.5 },
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'stretch' }
            }}
          >
            {whyChooseTTO.features.map((feature, index) => {
              const IconComponent = iconMap[feature.iconName] || Search;
              return (
                <Card
                  key={index}
                  sx={{
                    flex: { md: '1 1 0' },
                    width: { xs: '100%' },
                    maxWidth: { xs: '340px', sm: '350px', md: '360px' },
                    border: 'none',
                    borderRadius: '16px',
                    p: { xs: 2, sm: 2.5, md: 3 },
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-7px)',
                      '& .feature-icon-container': {
                        backgroundColor: feature.iconColor,
                      },
                      '& .feature-icon': {
                        color: '#ffffff !important',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Box textAlign="center">
                      <Box
                        className="feature-icon-container"
                        sx={{
                          width: { xs: 58, sm: 64, md: 64 },
                          height: { xs: 58, sm: 64, md: 64 },
                          borderRadius: '16px',
                          bgcolor: feature.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: { xs: 2, sm: 2.5 },
                          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                        }}
                      >
                        <IconComponent
                          className="feature-icon"
                          sx={{
                            fontSize: { xs: 28, sm: 30, md: 30 },
                            color: feature.iconColor,
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' },
                          fontWeight: 600,
                          mb: { xs: 1, sm: 1.5 },
                          color: '#1f2937'
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '0.95rem' },
                          color: '#6b7280',
                          lineHeight: 1.55
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
          py: { xs: 6, sm: 8, md: 10 },
          px: 0,
          width: '100%',
          margin: 0,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            display: { xs: 'none', md: 'block' }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            display: { xs: 'none', md: 'block' }
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              color: 'white',
              mb: 2,
              lineHeight: 1.2
            }}
          >
            {makingImpact.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              color: 'rgba(255, 255, 255, 0.9)',
              mb: { xs: 4, sm: 5, md: 6 },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            {makingImpact.subtitle}
          </Typography>
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} justifyContent="center">
            {makingImpact.stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box textAlign="center">
                  <Typography variant="h3" sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }, fontWeight: 800, color: 'white', mb: 1, lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }, color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500, lineHeight: 1.3 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 7, sm: 9, md: 10 },
          bgcolor: '#f8fafc',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: { xs: 100, md: 150 }, height: { xs: 100, md: 150 }, bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', filter: 'blur(40px)', animation: `${pulse} 6s ease-in-out infinite alternate` }} />
        <Box sx={{ position: 'absolute', bottom: '15%', right: '8%', width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 }, bgcolor: 'rgba(168, 85, 247, 0.05)', borderRadius: '50%', filter: 'blur(35px)', animation: `${pulse} 5s ease-in-out infinite alternate-reverse` }} />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box textAlign="center" sx={{ mb: { xs: 6, sm: 8, md: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem' },
                fontWeight: 700,
                mb: 2.5,
                color: '#1f2937',
                lineHeight: 1.2
              }}
            >
              {howItWorks.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                color: '#6b7280',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              {howItWorks.subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              alignItems: { xs: 'center', lg: 'flex-start' },
              gap: { xs: theme.spacing(5), lg: 0 },
              maxWidth: {lg: '1000px' },
              mx: 'auto',
            }}
          >
            {howItWorks.timelineSteps.map((step, index) => (
              <Box
                key={index}
                sx={{
                  flex: { lg: 1 },
                  width: { xs: '100%' },
                  maxWidth: { xs: '380px', lg: 'none' },
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  px: { lg: theme.spacing(2) },
                  pb: { xs: index < howItWorks.timelineSteps.length - 1 ? theme.spacing(5) : theme.spacing(2), lg: theme.spacing(2) }
                }}
              >
                {index < howItWorks.timelineSteps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', lg: 'block' },
                      position: 'absolute',
                      top: `${circleSizes.md / 2 - 1}px`,
                      left: '50%',
                      width: '100%',
                      height: '2px',
                      background: theme.palette.grey[300],
                      zIndex: 0,
                    }}
                  />
                )}

                {index < howItWorks.timelineSteps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'block', lg: 'none' },
                      position: 'absolute',
                      top: `${circleSizes.xs + theme.spacing(circleMb.xs / 2)}px`, /* Adjusted for icon size and margin */
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '2px',
                      height: theme.spacing(5), /* Controls length of vertical line */
                      background: theme.palette.grey[300],
                      zIndex: 0,
                    }}
                  />
                )}
                
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Box
                    sx={{
                      width: { xs: circleSizes.xs, sm: circleSizes.sm, md: circleSizes.md },
                      height: { xs: circleSizes.xs, sm: circleSizes.sm, md: circleSizes.md },
                      borderRadius: '50%',
                      bgcolor: step.dotColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: { xs: theme.spacing(circleMb.xs), sm: theme.spacing(circleMb.sm) },
                      boxShadow: `0 7px 22px ${alpha(step.dotColor, 0.25)}`,
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.05)',
                        boxShadow: `0 12px 30px ${alpha(step.dotColor, 0.35)}`
                      }
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' },
                        fontWeight: 700,
                        color: 'white'
                      }}
                    >
                      {step.label}
                    </Typography>
                  </Box>

                  <Box sx={{ px: { xs: 1, sm: 1 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                        fontWeight: 600,
                        mb: 1.5,
                        color: '#1f2937',
                        lineHeight: 1.3
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        color: '#6b7280',
                        lineHeight: 1.6,
                        maxWidth: '260px',
                        mx: 'auto'
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;