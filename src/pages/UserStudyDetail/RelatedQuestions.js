import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, border: '1px solid #ff0000', borderRadius: 1 }}>
          <Typography color="error">
            Something went wrong: {this.state.error?.message || 'Unknown error'}
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

const RelatedQuestions = ({ questions = [] }) => {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          No related questions available.
        </Typography>
      </Box>
    );
  }

  const formatInlineMarkdown = (text) => {
    if (!text || typeof text !== 'string') return text || '';
    
    try {
      const codeBlockRegex = /```([\s\S]*?)```/g;
      const codeBlocks = [];
      let codeBlockMatch;
      while ((codeBlockMatch = codeBlockRegex.exec(text)) !== null) {
        codeBlocks.push({
          start: codeBlockMatch.index,
          end: codeBlockMatch.index + codeBlockMatch[0].length,
          content: codeBlockMatch[1] || '',
          type: 'codeBlock'
        });
      }
      
      if (codeBlocks.length > 0) {
        const parts = [];
        let lastEnd = 0;
        
        codeBlocks.forEach((block, index) => {
          if (block.start > lastEnd) {
            const beforeText = text.slice(lastEnd, block.start);
            parts.push(formatInlineText(beforeText));
          }
          
          parts.push(
            <Box
              key={`codeblock-${index}`}
              component="pre"
              sx={{
                backgroundColor: "#F8F9FA",
                border: "1px solid #E9ECEF",
                borderRadius: "6px",
                padding: "12px",
                fontSize: "0.875rem",
                fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                color: "#24292F",
                overflow: "auto",
                margin: "8px 0",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {block.content}
            </Box>
          );
          
          lastEnd = block.end;
        });
        
        if (lastEnd < text.length) {
          const remainingText = text.slice(lastEnd);
          if (remainingText) parts.push(formatInlineText(remainingText));
        }
        
        return parts.length > 0 ? parts : text;
      }
      
      return formatInlineText(text);
    } catch (error) {
      console.error('Error formatting inline markdown:', error);
      return text;
    }
  };

  const formatInlineText = (text) => {
    if (!text || typeof text !== 'string') return text || '';
    
    try {
      const parts = [];
      
      const patterns = [
        { regex: /`([^`]+)`/g, component: 'code' },  
        { regex: /\*\*([^*]+)\*\*/g, component: 'strong' },  
        { regex: /\*([^*]+)\*/g, component: 'em' },  
      ];
      
      let matches = [];
      patterns.forEach((pattern, patternIndex) => {
        let match;
        const regex = new RegExp(pattern.regex.source, 'g');
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[1] || '',
            component: pattern.component,
            fullMatch: match[0],
            priority: patternIndex  
          });
        }
      });
      
      matches.sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start;
        return a.priority - b.priority;
      });
      
      const filteredMatches = [];
      for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        const isOverlapping = filteredMatches.some(existing => 
          (current.start < existing.end && current.end > existing.start)
        );
        if (!isOverlapping) {
          filteredMatches.push(current);
        }
      }
      
      let lastEnd = 0;
      filteredMatches.forEach((match, index) => {
        if (match.start > lastEnd) {
          const textPart = text.slice(lastEnd, match.start);
          if (textPart) parts.push(textPart);
        }
        
        const key = `format-${index}`;
        switch (match.component) {
          case 'strong':
            parts.push(<strong key={key}>{match.content}</strong>);
            break;
          case 'em':
            parts.push(<em key={key}>{match.content}</em>);
            break;
          case 'code':
            parts.push(
              <Box
                key={key}
                component="span"
                sx={{
                  backgroundColor: "#F3F4F6",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontSize: "0.875em",
                  fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                  color: "#DC2626",
                  fontWeight: 500,
                }}
              >
                {match.content}
              </Box>
            );
            break;
          default:
            parts.push(match.content);
        }
        
        lastEnd = match.end;
      });
      
      if (lastEnd < text.length) {
        const remainingText = text.slice(lastEnd);
        if (remainingText) parts.push(remainingText);
      }
      
      return parts.length > 0 ? parts : text;
    } catch (error) {
      console.error('Error formatting inline text:', error);
      return text;
    }
  };

  const parseMarkdown = (text) => {
    if (!text || typeof text !== 'string') {
      return (
        <Typography sx={{ color: "#6B7280", fontStyle: 'italic' }}>
          No content available
        </Typography>
      );
    }
    
    try {
      const parts = [];
      const lines = text.split('\n');
      let i = 0;
      
      while (i < lines.length) {
        const line = lines[i];
        
        if (line.trim() === '') {
          parts.push(<br key={`br-${i}`} />);
          i++;
          continue;
        }
        
        if (line.trim().startsWith('```')) {
          const codeLines = [];
          i++; 
          
          while (i < lines.length && !lines[i].trim().startsWith('```')) {
            codeLines.push(lines[i]);
            i++;
          }
          
          if (i < lines.length) i++; 
          
          parts.push(
            <Box
              key={`codeblock-${i}`}
              component="pre"
              sx={{
                backgroundColor: "#F8F9FA",
                border: "1px solid #E9ECEF",
                borderRadius: "6px",
                padding: "16px",
                fontSize: "0.875rem",
                fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                color: "#24292F",
                overflow: "auto",
                margin: "12px 0",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.5,
              }}
            >
              {codeLines.join('\n')}
            </Box>
          );
          continue;
        }
        
        if (line.match(/^#+\s/)) {
          const headerLevel = line.match(/^#+/)[0].length;
          const headerText = line.replace(/^#+\s*/, '');
          
          let variant, component, fontSize;
          switch (headerLevel) {
            case 1:
              variant = "h3";
              component = "h1";
              fontSize = "1.5rem";
              break;
            case 2:
              variant = "h4";
              component = "h2";
              fontSize = "1.3rem";
              break;
            case 3:
              variant = "h5";
              component = "h3";
              fontSize = "1.1rem";
              break;
            default:
              variant = "h6";
              component = "h4";
              fontSize = "1rem";
          }
          
          parts.push(
            <Typography
              key={`header-${i}`}
              variant={variant}
              component={component}
              sx={{
                fontWeight: 700,
                color: "#1F2937",
                fontSize: fontSize,
                mt: parts.length > 0 ? 2 : 0,
                mb: 1,
              }}
            >
              {headerText}
            </Typography>
          );
          i++;
          continue;
        }
        
        if (line.startsWith('- ') || line.startsWith('* ')) {
          parts.push(
            <Typography
              key={`bullet-${i}`}
              component="li"
              sx={{
                color: "#4B5563",
                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                fontWeight: 400,
                ml: 2,
                mb: 0.5,
                listStyleType: "disc",
                display: "list-item",
              }}
            >
              {formatInlineMarkdown(line.replace(/^[-*]\s*/, ''))}
            </Typography>
          );
          i++;
          continue;
        }
        
        if (/^\d+\.\s/.test(line)) {
          parts.push(
            <Typography
              key={`number-${i}`}
              component="li"
              sx={{
                color: "#4B5563",
                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                fontWeight: 400,
                ml: 2,
                mb: 0.5,
                listStyleType: "decimal",
                display: "list-item",
              }}
            >
              {formatInlineMarkdown(line.replace(/^\d+\.\s*/, ''))}
            </Typography>
          );
          i++;
          continue;
        }
        
        parts.push(
          <Typography
            key={`para-${i}`}
            sx={{
              color: "#4B5563",
              fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
              lineHeight: 1.7,
              fontWeight: 400,
              mb: 1,
            }}
          >
            {formatInlineMarkdown(line)}
          </Typography>
        );
        i++;
      }
      
      return parts;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return (
        <Typography sx={{ color: "#DC2626" }}>
          Error parsing content: {error.message}
        </Typography>
      );
    }
  };

  return (
    <ErrorBoundary>
      <Box
        sx={{
          mt: { xs: 6, sm: 6, md: 8 },
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "#1A202C",
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              textAlign: "left",
              mb: 2,
            }}
          >
            Related Questions
          </Typography>
        </Box>

        <Box
          sx={{
            borderTop: "1px solid #E5E7EB",
          }}
        >
          {questions.map((qa, index) => {
            if (!qa || typeof qa !== 'object') {
              console.warn(`Invalid question object at index ${index}:`, qa);
              return null;
            }

            const question = qa.question || `Question ${index + 1}`;
            const answer = qa.answer || 'No answer provided';

            return (
              <Accordion
                key={`accordion-${index}`}
                defaultExpanded={index === 0}
                elevation={0}
                sx={{
                  border: "none",
                  borderBottom: "1px solid #E5E7EB",
                  borderRadius: "0 !important",
                  backgroundColor: "transparent",
                  "&:before": { display: "none" },
                  "&:last-child": {
                    borderBottom: "1px solid #E5E7EB",
                  },
                  "&:hover": {
                    backgroundColor: "#F9FAFB",
                  },
                  transition: "background-color 0.15s ease-in-out",
                }}
              >
                <AccordionSummary
                  expandIcon={null}
                  sx={{
                    px: 0,
                    py: { xs: 2.5, sm: 3 },
                    minHeight: "auto",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "& .MuiAccordionSummary-content": {
                      margin: 0,
                      alignItems: "center",
                      justifyContent: "space-between",
                      "&.Mui-expanded": {
                        margin: 0,
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1F2937",
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.125rem" },
                      lineHeight: 1.4,
                      pr: 3,
                      flex: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {question}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#F3F4F6",
                      border: "1px solid #E5E7EB",
                      transition: "all 0.2s ease-in-out",
                      flexShrink: 0,
                      "&:hover": {
                        backgroundColor: "#2563EB",
                        borderColor: "#2563EB",
                        "& .MuiSvgIcon-root": {
                          color: "#FFFFFF",
                        },
                      },
                      ".Mui-expanded &": {
                        backgroundColor: "#2563EB",
                        borderColor: "#2563EB",
                        "& .MuiSvgIcon-root": {
                          color: "#FFFFFF",
                          transform: "rotate(45deg)",
                        },
                      },
                    }}
                  >
                    <AddIcon
                      sx={{
                        color: "#6B7280",
                        fontSize: "1.1rem",
                        transition: "all 0.2s ease-in-out",
                      }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    px: 0,
                    pb: { xs: 3, sm: 3.5 },
                    pt: 0,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "calc(100% - 60px)",
                      "& > *:last-child": {
                        mb: 0,
                      },
                    }}
                  >
                    {parseMarkdown(answer)}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default RelatedQuestions;