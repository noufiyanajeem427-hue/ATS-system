import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  Business,
  Work,
  People,
  TrendingUp,
  CalendarMonth,
  Email,
  Analytics,
  Settings,
  Message,
  Add,
  Person,
  Assessment,
  ChevronLeft,
  FileCopy,
  Group,
  Schedule,
} from "@mui/icons-material";

const drawerWidth = 280;

const menuItems = [
  {
    section: "MAIN",
    items: [
      { text: "Dashboard", icon: <Dashboard />, path: "/hr/dashboard" },
      { text: "Job Management", icon: <Work />, path: "/hr/jobs" },
      { text: "Create Job", icon: <Add />, path: "/hr/jobs" },
      { text: "Applications", icon: <FileCopy />, path: "/hr/applicants" },
      { text: "Candidate Details", icon: <Group />, path: "/hr/applicants" },
      { text: "AI Candidate Ranking", icon: <TrendingUp />, path: "/hr/ranking" },
      { text: "Interview Management", icon: <Schedule />, path: "/hr/interviews" },
      { text: "Reports & Analytics", icon: <Assessment />, path: "/hr/analytics" },
      { text: "Messages", icon: <Message />, path: "/hr/messages" },
    ],
  },
  {
    section: "ADMINISTRATIVE",
    items: [
      { text: "Company Profile", icon: <Business />, path: "/hr/company" },
      { text: "Settings", icon: <Settings />, path: "/hr/settings" },
    ],
  },
];

const Sidebar = ({ open, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 0,
          boxSizing: "border-box",
          mt: 8,
          backgroundColor: "#111827",
          color: "#e2e8f0",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f5f9",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#94a3b8",
          },
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "flex-start",
          px: 3,
          minHeight: "88px !important",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#6c63e0', display: 'grid', placeItems: 'center' }}>
            <Typography variant="button" sx={{ color: '#fff', fontWeight: 700 }}>
              N
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
              Nexus AI
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              AI HR Portal
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Box sx={{ overflow: 'auto', px: 1.5, pb: 4 }}>
        {menuItems.map(({ section, items }, sectionIndex) => (
          <Box key={section} sx={{ mb: sectionIndex === menuItems.length - 1 ? 0 : 3 }}>
            {open && (
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  letterSpacing: '0.14em',
                  fontWeight: 700,
                  mb: 1,
                  display: 'block',
                }}
              >
                {section}
              </Typography>
            )}
            <List disablePadding>
              {items.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    px: open ? 2 : 0,
                    justifyContent: open ? 'flex-start' : 'center',
                    minHeight: 48,
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-selected': {
                      backgroundColor: '#eff6ff',
                      '&:hover': {
                        backgroundColor: '#eff6ff',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#2563eb',
                      },
                      '& .MuiListItemText-primary': {
                        color: '#2563eb',
                        fontWeight: 600,
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: location.pathname === item.path ? '#2563eb' : '#64748b',
                      minWidth: open ? 40 : 'auto',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out',
                      '& svg': {
                        fontSize: 22,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        color: location.pathname === item.path ? '#2563eb' : '#f8fafc',
                      }}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};

export default Sidebar;