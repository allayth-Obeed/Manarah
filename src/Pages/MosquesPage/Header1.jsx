import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "../../theme/themeContext";

export default function Header1() {
  const { activeTheme } = useTheme();
  return (
    <Box style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        variant="contained"
        href="#contained-buttons"
        dir="ltr"
        endIcon={
          <AddIcon
            sx={{
              border: "2px solid",
              borderRadius: "50%",
              fontSize: 14,
            }}
          />
        }
        sx={{
          width: 198.28,
          height: 48,
          minWidth: 198.28,
          borderRadius: 1.5,
          bgcolor: activeTheme.colors.primary,
          textTransform: "none",
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1,
          justifyContent: "flex-end",
          boxShadow: "2px 2px 7px rgba(0,0,0,0.7)",
          "&:hover": {
            bgcolor: activeTheme.colors.primary,
          },
        }}
      >
        <Box component="span" dir="rtl">
          إضافة مسجد جديد
        </Box>
      </Button>
      <Box dir="rtl">
        <Typography
          variant="h5"
          sx={{
            textShadow: "2px 2px 2px rgba(0 , 0 , 0 , 0.3)",
            color: activeTheme.colors.primary,
            fontWeight: 700,
          }}
        >
          إدارة المساجد
        </Typography>
        <Typography
          sx={{ color: activeTheme.colors.mutedText, fontSize: 14, mt: 0.5 }}
        >
          عرض وتحديث بيانات المساجد المسجلة في المديرية
        </Typography>
      </Box>
    </Box>
  );
}
