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
import MosqueRoundedIcon from "@mui/icons-material/MosqueRounded";
import TopBar from "./TopBar";
import { NavLink, useLocation } from "react-router-dom";

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
  // CHANGES LOG:
  // - `palette` values moved out of this file and into `activeTheme.layout`.
  // - We removed the local `activeIndex` state and now derive active nav
  //   from the current route `pathname` (see `isActive` below).
  // - `TopBar` no longer receives `palette` or `activeTheme` as props;
  //   it reads theme tokens directly via `useTheme()`.
  const { activeTheme, themeMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const palette = activeTheme.layout;

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
        <TopBar toggleTheme={toggleTheme} themeMode={themeMode} />
        <Drawer
          sx={{
            width: { xs: 72, md: drawerWidth },
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: { xs: 72, md: drawerWidth },
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
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              // CHANGES: derive active state from route pathname
              const isActive = pathname === item.path;

              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    className="justify-center md:justify-start"
                    sx={{
                      borderRadius: 0,
                      minHeight: 44,
                      px: 2,
                      gap: 1,
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
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        WebkitMaskImage: {
                          xs: "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1) 60%)",
                          md: "none",
                        },
                        maskImage: {
                          xs: "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1) 60%)",
                          md: "none",
                        },
                        "& .MuiTypography-root": {
                          fontSize: 14,
                          fontWeight: isActive ? 700 : 600,
                          color: isActive
                            ? palette.navActiveText
                            : palette.navInactive,
                        },
                      }}
                    />
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
                <ListItemIcon sx={{ minWidth: 28, color: palette.danger }}>
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
                      color: palette.danger,
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
            bgcolor: activeTheme.colors.background,
          }}
          className="flex flex-col  flex-1 p-6 mt-22"
        >
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default AppLayout;
