import { Box, Typography } from "@mui/material";
import { useTheme } from "../../theme/themeContext";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";

export default function MainFun() {
  const { activeTheme, themeMode } = useTheme();
  return (
    <div>
      <Box
        dir="rtl"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: activeTheme.colors.primary,
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            لوحة التحكم
          </Typography>
          <Typography sx={{ color: activeTheme.colors.mutedText }}>
            نظرة عامة على نشاط المديرية والأصول الوقفية لهذا اليوم.
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            endIcon={
              <CampaignOutlinedIcon
                sx={{
                  color:
                    themeMode === "dark" ? "#fff" : activeTheme.colors.primary,
                  fontSize: 18,
                }}
              />
            }
            sx={{
              backgroundColor: activeTheme.colors.btn,
              color: themeMode === "dark" ? "#fff" : activeTheme.colors.primary,
              border: "2px solid " + activeTheme.colors.border,
              borderRadius: 3,
              px: 0,
              py: 0.8,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              minWidth: 140,
              mr: 2,
              boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
              display: "inline-flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            إعلان جديد
          </Button>
          <Button
            variant="contained"
            endIcon={<AddIcon sx={{ color: "#fff", fontSize: 18 }} />}
            sx={{
              backgroundColor: activeTheme.colors.primary,
              color: "#fff",
              borderRadius: 3,
              px: 0,
              py: 0.8,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              minWidth: 140,
              mr: 2,
              boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
              display: "inline-flex",
              alignItems: "center",
              flexDirection: "row-reverse",
              "&:hover": { backgroundColor: activeTheme.colors.primary },
            }}
          >
            إضافة مسجد
          </Button>
        </Box>
      </Box>
      
    </div>
  );
}
