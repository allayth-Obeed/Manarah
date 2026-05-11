import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useTheme } from "../../theme/themeContext";

const chartData = [
  { day: "السبت", value: 400 },
  { day: "الأحد", value: 300 },
  { day: "الإثنين", value: 500 },
  { day: "الثلاثاء", value: 700 },
  { day: "الأربعاء", value: 600 },
  { day: "الخميس", value: 800 },
  { day: "الجمعة", value: 900 },
];

const speakers = [
  {
    mosque: "جامع القوي",
    speaker: "د. محمد السعيد",
    date: "24 مايو 2024",
  },
  {
    mosque: "مسجد النور",
    speaker: "الشيخ عمر الخالد",
    date: "23 مايو 2024",
  },
  {
    mosque: "جامع الروضة",
    speaker: "أ. إبراهيم علي",
    date: "22 مايو 2024",
  },
  {
    mosque: "مسجد التقوى",
    speaker: "الشيخ حسن محمود",
    date: "21 مايو 2024",
  },
];

const tableHeaders = ["اسم المسجد", "اسم الخطيب", "التاريخ"];

// Card shell used to keep dashboard sections visually consistent.
function SectionCard({ cardSx, titleSx, title, action, children }) {
  return (
    <>
      {/* Card wrapper for the section. */}
      <Card sx={cardSx}>
        {/* Padding and content area inside the card. */}
        <CardContent>
          {/* Header row with title on one side and action on the other. */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            {/* Section title text. */}
            <Typography variant="h6" sx={titleSx}>
              {title}
            </Typography>
            {/* Optional header action element. */}
            {action}
          </Box>
          {/* Section body content passed from the page. */}
          {children}
        </CardContent>
      </Card>
    </>
  );
}

// Dashboard statistics view that shows assignments and weekly donations.
export default function Statistics() {
  const { activeTheme } = useTheme();
  const { colors, layout } = activeTheme;

  const cardSx = {
    borderRadius: 4,
    height: "100%",
    width: "100%",
    bgcolor: colors.surface,
    color: colors.text,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    border: `1px solid ${colors.border}`,
  };

  const titleSx = { fontWeight: "bold", color: colors.primary };
  const tableCellSx = { color: colors.text, borderColor: colors.border };
  const headerCellSx = { color: colors.mutedText, borderColor: colors.border };

  return (
    <>
      {/* Page wrapper for background, spacing, and full height. */}
      <Box
        sx={{
          p: 3,
          bgcolor: colors.background,
          color: colors.text,
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* Two-column grid that collapses to one column on small screens. */}
        <Box
          sx={{
            display: "grid",
            gap: 3,
            width: "100%",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {/* Left card: latest speaker assignments table. */}
          <Box sx={{ gridColumn: { md: "span 1" } }}>
            {/* Reusable card that wraps the table section. */}
            <SectionCard
              cardSx={cardSx}
              titleSx={titleSx}
              title="أحدث تكليفات الخطباء"
              action={
                <>
                  {/* Link-style action for viewing all records. */}
                  <Typography
                    variant="body2"
                    sx={{ color: colors.secondary, cursor: "pointer" }}
                  >
                    عرض الكل
                  </Typography>
                </>
              }
            >
              {/* Table container for assignment rows. */}
              <TableContainer>
                {/* Table with mosque, speaker, and date columns. */}
                <Table sx={{ "& .MuiTableCell-root": { color: colors.text } }}>
                  {/* Column headers row. */}
                  <TableHead>
                    {/* Header row for the table. */}
                    <TableRow>
                      {/* Header cells rendered from a list. */}
                      {tableHeaders.map((header) => (
                        <TableCell key={header} align="right" sx={headerCellSx}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  {/* Data rows for each speaker assignment. */}
                  <TableBody>
                    {speakers.map((row) => (
                      <TableRow key={`${row.mosque}-${row.date}`}>
                        {/* Mosque name cell. */}
                        <TableCell align="right" sx={tableCellSx}>
                          {row.mosque}
                        </TableCell>
                        {/* Speaker name cell. */}
                        <TableCell align="right" sx={tableCellSx}>
                          {row.speaker}
                        </TableCell>
                        {/* Date cell with a compact chip. */}
                        <TableCell align="right" sx={tableCellSx}>
                          <Chip
                            label={row.date}
                            size="small"
                            sx={{
                              bgcolor: colors.accent,
                              color: colors.primary,
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </SectionCard>
          </Box>

          {/* Right card: weekly donation trend chart. */}
          <Box sx={{ gridColumn: { md: "span 2" } }}>
            {/* Reusable card that wraps the chart section. */}
            <SectionCard
              cardSx={cardSx}
              titleSx={titleSx}
              title="تحليل التبرعات (أسبوعي)"
              action={
                <>
                  {/* Time-range chip for the chart. */}
                  <Chip
                    label="آخر 7 أيام"
                    sx={{ bgcolor: layout.searchBaseBg, color: colors.text }}
                  />
                </>
              }
            >
              {/* Fixed chart area that keeps the graph responsive. */}
              <Box sx={{ width: "100%", height: 300 }}>
                {/* Responsive wrapper around the line chart. */}
                <ResponsiveContainer width="100%" height="100%">
                  {/* Line chart using the weekly donation data. */}
                  <LineChart data={chartData}>
                    {/* Background grid for easier reading. */}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={colors.border}
                    />
                    {/* X axis with Arabic day labels. */}
                    <XAxis
                      dataKey="day"
                      stroke={layout.subTitle}
                      tick={{ fill: layout.subTitle }}
                    />
                    {/* Y axis with numeric values. */}
                    <YAxis
                      stroke={layout.subTitle}
                      tick={{ fill: layout.subTitle }}
                    />
                    {/* Tooltip for hovered chart values. */}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 12,
                        color: colors.text,
                      }}
                      labelStyle={{ color: colors.text }}
                      itemStyle={{ color: colors.primary }}
                    />
                    {/* Main donation trend line. */}
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={colors.primary}
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </SectionCard>
          </Box>
        </Box>
      </Box>
    </>
  );
}
