import React from "react";
import { Box, Button, Typography, Card, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "../../theme/themeContext";

export default function FilterSearch() {
  const { activeTheme } = useTheme();

  return (
    <Box
      dir="rtl"
      sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">تصفية بـ:</Typography>
        {/* filtering */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 , bgcolor:activeTheme.colors.bgelem , px:2.5 , py:1.5 , borderRadius:1.5}}>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                px: 5,
                paddingRight: 0.4,
                py: 0.8,
                fontSize: 13,
                bgcolor:activeTheme.colors.btn,
                color:activeTheme.colors.mutedText
              }}
            >
              كل المناطق
            </Button>
            
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                px: 5,
                paddingRight: 0.4,
                py: 0.8,
                fontSize: 13,
                bgcolor:activeTheme.colors.btn,
                color:activeTheme.colors.mutedText
              }}
            >
              كل الحالات
            </Button>
            <Box sx={{flexGrow:1}} />
            
            {/* Apply button */}
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                bgcolor: activeTheme.colors.primary,
                color: "#fff",
                px: 7,
                py: 0.8,
                fontWeight: 600,
              }}
            >
              تطبيق الفلترة
            </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {/* Stats cards */}
        <Card
          sx={{
            px: 2.5,
            py: 1,
            minWidth: 140,
            textAlign: "center",
            borderRadius: 1.5,
            bgcolor: activeTheme.colors.primary,
            color: "#fff",
            boxShadow: "0 3px 8px rgba(0,102,71,0.25)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900, fontSize: 18 }}>
            1,240
          </Typography>
          <Typography sx={{ fontSize: 12 }}>مسجد كلي</Typography>
        </Card>

        <Card
          sx={{
             px: 2.5,
            py: 1,
            minWidth: 140,
            textAlign: "center",
            borderRadius: 1.5,
            boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
            bgcolor:'#E4E2DE'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18 }}>
            12
          </Typography>
          <Typography
            sx={{
              color:
                activeTheme.layout?.subTitle || activeTheme.colors.mutedText,
              fontSize: 11,
            }}
          >
            قيد الصيانة
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
