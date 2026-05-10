import React from "react";
import { Box, Typography } from "@mui/material";
import { Shield, BarChart } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTheme } from "../../theme/themeContext";

export default function ReportsAndValid() {
  const { activeTheme } = useTheme();

  return (
    <Box className="flex flex-row gap-4 p-4">
      {/* بطاقة توثيق الأوقاف */}
      <Box
        className="flex-none w-1/3 bg-gray-100 rounded-xl p-6 flex flex-col items-start gap-4 h-[234px]"
        dir="rtl"
      >
        <Box className="bg-gray-200 w-14 h-14 flex items-center justify-center rounded-full">
          <Shield className="text-green-700 w-7 h-7" />
        </Box>
        <Typography variant="h6" className="text-gray-800 font-semibold">
          توثيق الأوقاف
        </Typography>
        <Typography className="text-gray-600 text-sm">
          تأكد من تحديث كافة الصكوك القانونية والخرائط المساحية للمساجد الحديثة
          في النظام لضمان الحماية القانونية للأصول.
        </Typography>
      </Box>

      {/* بطاقة التقرير السنوي لصيانة المساجد */}
      <Box
        className="flex-1 bg-gradient-to-br from-emerald-900 to-green-800 rounded-xl p-6 flex flex-col justify-between gap-4 text-white h-[234px] relative"
        dir="rtl"
      >
        <Box className="absolute left-8 top-1/2 -translate-y-1/2 opacity-10 w-28 h-28 bg-emerald-900 rounded-lg flex items-center justify-center z-0">
          <BarChart className="w-10 h-10 text-emerald-700/50" />
        </Box>

        <Box className="absolute right-6 top-6 z-20 w-12 h-12 bg-emerald-700/90 rounded-full flex items-center justify-center shadow-sm">
          <BarChart className="w-6 h-6 text-emerald-200" />
        </Box>

        <Box className="w-2/3 ml-auto z-30">
          <Box className="flex items-center gap-4">
            <Box className="bg-emerald-800 p-3 rounded-full flex items-center justify-center">
              <BarChart className="w-6 h-6 text-green-300" />
            </Box>
            <Typography variant="h5" className="font-semibold text-white">
              التقارير السنوية لصيانة المساجد
            </Typography>
          </Box>
          <Typography className="text-emerald-200 mt-3 pr-6">
            تم إكمال 85٪ من خطة الصيانة السنوية للمساجد التابعة للمديرية. يمكنك
            تنزيل التقرير الكامل بصيغة PDF لمراجعة كافة التفاصيل.
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            position: "absolute",
            right: 36,
            bottom: 20,
            minWidth: 140,
            height: 44,
            px: 2,
            py: 0.5,
            borderRadius: 1.5,
            boxShadow: 2,
            bgcolor: activeTheme.colors.secondary,
            color: "#fff",
            zIndex: 30,
            textTransform: "none",
          }}
        >
          تحميل التقرير الكامل
        </Button>
      </Box>
    </Box>
  );
}
