import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Avatar, Box, Divider, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "../../theme/themeContext";

const drawerWidth = 240;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  maxWidth: 430,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  right: 0,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    textAlign: "right",
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

function TopBar() {
  const { activeTheme, themeMode, toggleTheme } = useTheme();
  const palette = activeTheme.layout;

  const user = {
    name: "احمد الموصلي",
    role: "مشرف النظام",
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        mr: { xs: 0, md: `${drawerWidth}px` },
        boxShadow: "none",
        borderBottom: `1px solid ${palette.sidebarBorder}`,
        backgroundColor: palette.sidebarBg,
        color: activeTheme.colors.text,
      }}
    >
      <Toolbar sx={{ px: { xs: 1.5, md: 2.5 }, minHeight: 72 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.5,
              minWidth: { xs: "auto", md: 300 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: activeTheme.colors.primary,
                  fontSize: 14,
                }}
              >
                أ
              </Avatar>
              <Box sx={{ lineHeight: 1.2 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: activeTheme.colors.mutedText,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {user.role}
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <Box className="flex items-center gap-0.5 flex-col md:flex-row">
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{ color: activeTheme.colors.mutedText }}
              >
                {themeMode === "dark" ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: activeTheme.colors.mutedText }}
              >
                <AccountCircle fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: activeTheme.colors.mutedText }}
              >
                <NotificationsIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            {/* CHANGES: search uses theme tokens from `palette` for background and border */}
            <Search
              sx={{
                border: `1px solid ${palette.searchBorder}`,
                backgroundColor: palette.searchBaseBg,
                width: { xs: "100%", sm: "60%", md: "auto" },
                maxWidth: { xs: "100%", sm: 430 },
                "&:hover": {
                  backgroundColor: palette.searchHoverBg,
                },
              }}
            >
              <SearchIconWrapper>
                <SearchIcon fontSize="small" />
              </SearchIconWrapper>
              <StyledInputBase
                dir="rtl"
                placeholder="بحث عن مسجد أو إمام..."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              minWidth: "fit-content",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                color: activeTheme.colors.primary,
              }}
            >
              مديرية الأوقاف
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
