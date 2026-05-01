import { useTheme } from "../../theme/themeContext";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import MosqueOutlinedIcon from "@mui/icons-material/MosqueOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import { useState } from "react";
import MosqueRoundedIcon from "@mui/icons-material/MosqueRounded";
import TopBar from "./TopBar";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { label: "الرئيسية", icon: GridViewOutlinedIcon, path: "/" },
  { label: "المساجد", icon: MosqueOutlinedIcon, path: "/mosques" },
  { label: "الموظفين", icon: BadgeOutlinedIcon, path: "/employees" },
  { label: "توزيع الخطباء", icon: EventNoteOutlinedIcon, path: "/preachers" },
  { label: "التبرعات", icon: PaymentsOutlinedIcon, path: "/donations" },
  { label: "الإعلانات", icon: CampaignOutlinedIcon, path: "/ads" },
];

const AppLayout = ({ children }) => {
  const { activeTheme, themeMode, toggleTheme } = useTheme();
  const isDarkMode = themeMode === "dark";
  const [activeIndex, setActiveIndex] = useState(0);

  const palette = isDarkMode
    ? {
        sidebarBg: "#111827",
        sidebarBorder: "#334155",
        navInactive: "#CBD5E1",
        tnavActiveBg: "rgba(148, 163, 184, 0.16)",
        navHoverBg: "rgba(148, 163, 184, 0.12)",
        navActiveText: "#4ADE80",
        navActiveBorder: "#EAB308",
        subTitle: "#94A3B8",
        logout: "#F87171",
        logoText: "#4ADE80",
      }
    : {
        sidebarBg: "#FFFFFF",
        sidebarBorder: "#E6EBEF",
        navInactive: "#7C879B",
        navActiveBg: "#ECEFEE",
        navHoverBg: "#F5F7F8",
        navActiveText: "#006747",
        navActiveBorder: "#C39D57",
        subTitle: "#9AA3B2",
        logout: "#D64040",
        logoText: "#006747",
      };

  return (
    <div
      dir="rtl"
      className="min-h-screen transition-colors duration-200 ease-in-out"
      style={{
        backgroundColor: activeTheme.colors.background,
        color: activeTheme.colors.text,
        fontFamily: activeTheme.fontFamily.arabic.join(", "),
      }}
    >
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar
          toggleTheme={toggleTheme}
          themeMode={themeMode}
          palette={palette}
          activeTheme={activeTheme}
        />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: palette.sidebarBg,
              color: activeTheme.colors.text,
              borderLeft: `2px solid ${palette.sidebarBorder}`,
              px: 1.5,
              py: 2,
            },
          }}
          variant="permanent"
          anchor="right"
        >
          <Box className=" mt-3 mb-2  flex items-start gap-1.5">
            <Box
              sx={{
                bgcolor: activeTheme.colors.primary,
              }}
              className="w-10 h-10 rounded-md text-white flex items-center justify-center"
            >
              <MosqueRoundedIcon fontSize="18px" />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: 31,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: palette.logoText,
                }}
              >
                مديرية الأوقاف
              </Typography>
              <Typography
                sx={{ fontSize: 14, lineHeight: 1.3, color: palette.subTitle }}
              >
                نظام إدارة الأصول
              </Typography>
            </Box>
          </Box>

          <List sx={{ mt: 1 }}>
            {navItems.map((item, index) => {
              const ItemIcon = item.icon;
              const isActive = activeIndex === index;

              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={() => setActiveIndex(index)}
                    sx={{
                      borderRadius: 0,
                      minHeight: 44,
                      px: 2,
                      gap: 1,
                      justifyContent: "flex-start",
                      borderRight: isActive
                        ? `3px solid ${palette.navActiveBorder}`
                        : "3px solid transparent",
                      backgroundColor: isActive
                        ? palette.navActiveBg
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? palette.navActiveBg
                          : palette.navHoverBg,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 28,
                        color: isActive
                          ? palette.navActiveText
                          : palette.navInactive,
                      }}
                    >
                      <ItemIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        m: 0,
                        textAlign: "right",
                        "& .MuiTypography-root": {
                          fontSize: 14,
                          fontWeight: isActive ? 700 : 600,
                          color: isActive
                            ? palette.navActiveText
                            : palette.navInactive,
                        },
                      }}
                    >
                      {item.label}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <List>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton sx={{ minHeight: 42, px: 2, gap: 1 }}>
                <ListItemIcon sx={{ minWidth: 28, color: palette.navInactive }}>
                  <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="الإعدادات"
                  sx={{
                    m: 0,
                    textAlign: "right",
                    "& .MuiTypography-root": {
                      fontSize: 14,
                      fontWeight: 600,
                      color: palette.navInactive,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton sx={{ minHeight: 42, px: 2, gap: 1 }}>
                <ListItemIcon sx={{ minWidth: 28, color: palette.logout }}>
                  <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="تسجيل الخروج"
                  sx={{
                    m: 0,
                    textAlign: "right",
                    "& .MuiTypography-root": {
                      fontSize: 14,
                      fontWeight: 600,
                      color: palette.logout,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Box sx={{ height: 6 }} />
        </Drawer>
        {/* for main content */}
        <Box
          dir="ltr"
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            bgcolor: activeTheme.colors.background,
            p: 3,
            mt: 8,
          }}
        >
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default AppLayout;
