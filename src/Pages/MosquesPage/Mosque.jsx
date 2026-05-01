import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useTheme } from "../../theme/themeContext";

export default function Mosque() {
  const { activeTheme } = useTheme();

  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <Button
        variant="contained"
        href="#contained-buttons"
        dir="ltr"
        startIcon={
          <AddIcon
            sx={{
              border: "2px solid",
              borderRadius: "50%",
              fontSize: 14,
              color: activeTheme.colors.text,
            }}
          />
        }
        sx={{
          width: 198.28,
          height: 48,
          minWidth: 198.28,
          px: 2,
          borderRadius: 1.5,
          bgcolor: activeTheme.colors.primary,
          color: activeTheme.colors.text,
          boxShadow: "none",
          textTransform: "none",
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1,
          justifyContent: "space-between",
          "&:hover": {
            bgcolor: activeTheme.colors.primary,
            boxShadow: "none",
          },
        }}
      >
        <Box component="span" dir="rtl">
          إضافة مسجد جديد
        </Box>
      </Button>
    </div>
  );
}
