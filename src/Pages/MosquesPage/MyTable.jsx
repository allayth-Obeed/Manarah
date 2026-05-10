import React from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BuildIcon from "@mui/icons-material/Build";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MosqueIcon from "@mui/icons-material/Mosque";
import { useTheme } from "../../theme/themeContext";

const ROWS = [
  {
    id: 1,
    mosque: "جامع النبي يونس",
    founded: "تاريخ التأسيس: 1994",
    location: "نبوي، حي النبي يونس",
    imam: "د. محمود المشهداني",
    imamImg: "https://via.placeholder.com/40",
    capacity: 2500,
    status: "نشط",
  },
  {
    id: 2,
    mosque: "جامع الخلفاء",
    founded: "تاريخ التأسيس: 2005",
    location: "بغداد، الرصافة",
    imam: "الشيخ علي الراوي",
    imamImg: "https://via.placeholder.com/40",
    capacity: 1800,
    status: "نشط",
  },
  {
    id: 3,
    mosque: "جامع النور الكبير",
    founded: "خاضع للترميم حاليا",
    location: "الموصل، المدينة القديمة",
    imam: "غير معرّف",
    imamImg: "https://via.placeholder.com/40",
    capacity: 3200,
    status: "تحت الصيانة",
  },
];

const COLUMNS = [
  { key: "mosque", label: "اسم المسجد", align: "right" },
  { key: "location", label: "الموقع / الحي", align: "right" },
  { key: "imam", label: "اسم الإمام", align: "right" },
  { key: "capacity", label: "السعة", align: "center" },
  { key: "status", label: "الحالة", align: "center" },
];

const TOTAL_ROWS = 1240;
const ROWS_PER_PAGE = 10;
const PAGE_INDEXES = [2, 1, 0];
const TOTAL_PAGES = PAGE_INDEXES.length;

// تُرجع أنماط العرض (أيقونة، خلفية، نوع الشيب) بناءً على حالة المسجد.
// تستعمل القيمة الافتراضية إذا لم تكن الحالة معرفة صراحةً.
const getStatusStyle = (status, colors) => {
  if (status === "نشط") {
    return {
      iconBg: alpha(colors.primary, 0.12),
      icon: <MosqueIcon sx={{ color: colors.primary, fontSize: 20 }} />,
      chipSx: {
        color: colors.primary,
        bgcolor: alpha(colors.primary, 0.12),
        border: `1px solid ${alpha(colors.primary, 0.2)}`,
      },
    };
  }

  if (status === "تحت الصيانة") {
    return {
      iconBg: alpha(colors.secondary, 0.14),
      icon: <BuildIcon sx={{ color: colors.secondary, fontSize: 20 }} />,
      chipSx: {
        color: colors.secondary,
        bgcolor: alpha(colors.secondary, 0.14),
        border: `1px solid ${alpha(colors.secondary, 0.25)}`,
      },
    };
  }

  return {
    iconBg: colors.accent,
    icon: <MosqueIcon sx={{ color: colors.primary, fontSize: 20 }} />,
    chipSx: {
      color: colors.text,
      bgcolor: colors.accent,
      border: `1px solid ${colors.border}`,
    },
  };
};

// تُحوّل قيمة رقمية إلى نص مع فواصل الآلاف باستخدام تنسيق `en-US`.
const formatNumber = (value) => value.toLocaleString("en-US");

// ترتّب مصفوفة الصفوف بحسب المفتاح `orderBy` والاتجاه `order`.
// تتعامل مع الحقل `capacity` كقيمة رقمية، وتستخدم المقارنة المحلّية للنصوص.
const sortRows = (rows, orderBy, order) => {
  const dir = order === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (orderBy === "capacity") {
      return (aValue - bValue) * dir;
    }

    return String(aValue || "").localeCompare(String(bValue || ""), "ar") * dir;
  });
};

// مكوّن الجدول الرئيسي لعرض بيانات المساجد.
// يدير الحالة المحلية (الصفحة، ترتيب الأعمدة)، يحسب الصفوف المرتبة،
// ويعرض واجهة المستخدم بما في ذلك أزرار التصفح والإجراءات.
const MyTable = () => {
  const { activeTheme } = useTheme();
  const colors = activeTheme.colors;
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState("mosque");
  const [order, setOrder] = React.useState("asc");

  // يغيّر الصفحة الحالية إلى `newPage` إذا كانت ضمن النطاق المسموح.
  const handleChangePage = (newPage) => {
    if (newPage < 0 || newPage >= TOTAL_PAGES) return;
    setPage(newPage);
  };

  // يتعامل مع طلبات ترتيب الأعمدة: عكس اتجاه الترتيب إذا نقرنا على العمود نفسه
  // أو تحديد عمود جديد للترتيب.
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(
    () => sortRows(ROWS, orderBy, order),
    [orderBy, order],
  );

  const rangeStart = page * ROWS_PER_PAGE + 1;
  const rangeEnd = Math.min((page + 1) * ROWS_PER_PAGE, TOTAL_ROWS);

  return (
    <Paper
      sx={{
        p: 0,
        bgcolor: colors.surface,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table
          dir="rtl"
          sx={{
            direction: "rtl",
            "& .MuiTableCell-root": {
              borderColor: colors.border,
            },
          }}
        >
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sortDirection={orderBy === column.key ? order : false}
                  sx={{
                    bgcolor: alpha(colors.primary, 0.04),
                    color: colors.mutedText,
                    fontWeight: 700,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === column.key}
                    direction={orderBy === column.key ? order : "asc"}
                    onClick={() => handleRequestSort(column.key)}
                    sx={{
                      color: colors.mutedText,
                      "&.Mui-active": { color: colors.primary },
                      "& .MuiTableSortLabel-icon": {
                        color: `${colors.primary} !important`,
                      },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{
                  bgcolor: alpha(colors.primary, 0.04),
                  color: colors.mutedText,
                  fontWeight: 700,
                }}
              >
                إجراءات
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => {
              const statusStyle = getStatusStyle(row.status, colors);
              const isMaintenance = row.status === "تحت الصيانة";
              const mutedColor = colors.mutedText;

              return (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: alpha(colors.primary, 0.04),
                    },
                  }}
                >
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: statusStyle.iconBg,
                        }}
                      >
                        {statusStyle.icon}
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: isMaintenance ? mutedColor : colors.text,
                          }}
                        >
                          {row.mosque}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: isMaintenance
                              ? mutedColor
                              : colors.mutedText,
                          }}
                        >
                          {row.founded}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ color: isMaintenance ? mutedColor : colors.text }}
                  >
                    {row.location}
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Avatar
                        src={row.imamImg}
                        sx={{
                          width: 32,
                          height: 32,
                          opacity: isMaintenance ? 0.55 : 1,
                        }}
                      />
                      <Typography
                        sx={{ color: isMaintenance ? mutedColor : colors.text }}
                      >
                        {row.imam}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ color: isMaintenance ? mutedColor : colors.text }}
                  >
                    {formatNumber(row.capacity)}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={row.status}
                      size="small"
                      variant="outlined"
                      sx={{
                        px: 1,
                        ...statusStyle.chipSx,
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      <IconButton size="small" aria-label="more">
                        <MoreVertIcon
                          fontSize="small"
                          sx={{
                            color: isMaintenance
                              ? mutedColor
                              : colors.mutedText,
                          }}
                        />
                      </IconButton>
                      <IconButton size="small" aria-label="delete">
                        <DeleteIcon
                          fontSize="small"
                          sx={{
                            color: isMaintenance
                              ? mutedColor
                              : colors.mutedText,
                          }}
                        />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* الشريط السفلي */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 2,
          borderTop: `1px solid ${colors.border}`,
          bgcolor: alpha(colors.primary, 0.02),
        }}
      >
        <Typography sx={{ color: colors.mutedText, fontSize: 13 }}>
          {`عرض ${rangeStart}-${rangeEnd} من أصل ${TOTAL_ROWS.toLocaleString("en-US")} مسجداً`}
        </Typography>

        <Box dir="ltr" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleChangePage(page + 1)}
            disabled={page === TOTAL_PAGES - 1}
            sx={{
              border: `1px solid ${colors.border}`,
              borderRadius: 1,
              width: 32,
              height: 32,
              color: colors.text,
              bgcolor: colors.surface,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          {PAGE_INDEXES.map((pageIndex) => (
            <Box
              key={pageIndex}
              onClick={() => handleChangePage(pageIndex)}
              sx={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1.25,
                border: `1px solid ${
                  pageIndex === page
                    ? activeTheme.layout.navActiveBorder
                    : colors.border
                }`,
                bgcolor: pageIndex === page ? colors.primary : colors.surface,
                color: pageIndex === page ? colors.surface : colors.text,
                fontSize: 14,
                fontWeight: pageIndex === page ? 800 : 700,
                lineHeight: 1,
                boxShadow:
                  pageIndex === page
                    ? `0 0 0 1px ${alpha(colors.primary, 0.08)}`
                    : "none",
                transition: "all 0.15s ease",
                cursor: "pointer",
                userSelect: "none",
                "&:hover": {
                  bgcolor:
                    pageIndex === page
                      ? colors.primary
                      : alpha(colors.primary, 0.06),
                },
              }}
            >
              {pageIndex + 1}
            </Box>
          ))}

          <IconButton
            size="small"
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            sx={{
              border: `1px solid ${colors.border}`,
              borderRadius: 1,
              width: 32,
              height: 32,
              color: colors.text,
              bgcolor: colors.surface,
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default MyTable;
