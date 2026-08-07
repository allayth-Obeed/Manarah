import React from 'react'
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
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import BuildIcon from '@mui/icons-material/Build'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit' // ADDED: زر تعديل اختياري (يظهر فقط عند تمرير onRowEditClick)
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MosqueIcon from '@mui/icons-material/Mosque'
import PersonIcon from '@mui/icons-material/Person'
import { useTheme } from '../../theme/themeContext'

const COLUMNS = [
  { key: 'mosque', label: 'اسم المسجد', align: 'right' },
  { key: 'location', label: 'الموقع / الحي', align: 'right' },
  { key: 'imam', label: 'اسم الإمام', align: 'right' },
  { key: 'capacity', label: 'السعة', align: 'center' },
  { key: 'status', label: 'الحالة', align: 'center' },
]

// تم حذف ROWS/TOTAL_ROWS الوهمية: كل المستدعين الحاليين يمرّرون rows/totalRows حقيقية دائماً
// ADDED: مرجع ثابت لمصفوفة فارغة بدل [] جديدة بكل رندر — يمنع تغيّر رابط useMemo أدناه في كل مرة
const EMPTY_ROWS = []
const ROWS_PER_PAGE = 10
const PAGE_INDEXES = [2, 1, 0]
const TOTAL_PAGES = PAGE_INDEXES.length

// تُرجع أنماط العرض (أيقونة، خلفية، نوع الشيب) بناءً على حالة المسجد.
// تستعمل القيمة الافتراضية إذا لم تكن الحالة معرفة صراحةً.
const getStatusStyle = (status, colors) => {
  // دعم حالات الموظفين البسيطة إلى جانب حالات المساجد
  if (status === 'على رأس العمل' || status === 'نشط') {
    return {
      iconBg: alpha(colors.primary, 0.12),
      icon: <MosqueIcon sx={{ color: colors.primary, fontSize: 20 }} />,
      chipSx: {
        color: colors.primary,
        bgcolor: alpha(colors.primary, 0.12),
        border: `1px solid ${alpha(colors.primary, 0.2)}`,
      },
    }
  }

  if (status === 'إجازة') {
    return {
      iconBg: alpha(colors.secondary, 0.14),
      icon: <BuildIcon sx={{ color: colors.secondary, fontSize: 20 }} />,
      chipSx: {
        color: colors.secondary,
        bgcolor: alpha(colors.secondary, 0.14),
        border: `1px solid ${alpha(colors.secondary, 0.25)}`,
      },
    }
  }

  if (status === 'قيد الصيانة') {
    return {
      iconBg: alpha(colors.secondary, 0.14),
      icon: <BuildIcon sx={{ color: colors.secondary, fontSize: 20 }} />,
      chipSx: {
        color: colors.secondary,
        bgcolor: alpha(colors.secondary, 0.14),
        border: `1px solid ${alpha(colors.secondary, 0.25)}`,
      },
    }
  }

  return {
    iconBg: colors.accent,
    icon: <MosqueIcon sx={{ color: colors.primary, fontSize: 20 }} />,
    chipSx: {
      color: colors.text,
      bgcolor: colors.accent,
      border: `1px solid ${colors.border}`,
    },
  }
}

// تُحوّل قيمة رقمية إلى نص مع فواصل الآلاف باستخدام تنسيق `en-US`.
const formatNumber = (value) => value.toLocaleString('en-US')

// ترتّب مصفوفة الصفوف بحسب المفتاح `orderBy` والاتجاه `order`.
// تتعامل مع الحقل `capacity` كقيمة رقمية، وتستخدم المقارنة المحلّية للنصوص.
const sortRows = (rows, orderBy, order) => {
  const dir = order === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const aValue = a[orderBy]
    const bValue = b[orderBy]

    if (orderBy === 'capacity') {
      return (aValue - bValue) * dir
    }

    return String(aValue || '').localeCompare(String(bValue || ''), 'ar') * dir
  })
}

// مكوّن الجدول القابل لإعادة الاستخدام.
// يقبل `rows` و `columns` وقيَم الترحيل كخصائص، ويعطي سلوكًا افتراضيًا لصفحات المساجد إذا لم تُمرّر خصائص.
const MyTable = ({
  rows: propRows,
  columns: propColumns,
  totalRows: propTotalRows,
  totalPages: propTotalPages,
  entityLabel = 'مسجد',
  rowsPerPage: propRowsPerPage,
  onRowMoreClick,
  onRowEditClick, // اختياري — لو مُرِّر يظهر زر تعديل إضافي
  onRowViewClick, // ADDED: اختياري — لو مُرِّر يظهر رابط "عرض التفاصيل" (كان يظهر دائماً بلا وظيفة لصفوف الموظفين)
  onRowDeleteClick,
}) => {
  const { activeTheme } = useTheme()
  const colors = activeTheme.colors

  const rows = propRows ?? EMPTY_ROWS // MODIFIED: مرجع ثابت لمصفوفة فارغة بدل بيانات وهمية أو [] جديدة بكل رندر
  const columns = propColumns || COLUMNS
  const rowsPerPage = propRowsPerPage || ROWS_PER_PAGE
  const totalRows = propTotalRows ?? 0 // MODIFIED: ?? بدل || حتى لا يتحول 0 (لا نتائج) إلى رقم وهمي
  const totalPages = propTotalPages || TOTAL_PAGES
  const pageIndexes = propTotalPages
    ? Array.from({ length: totalPages }, (_, i) => i)
    : PAGE_INDEXES

  const [page, setPage] = React.useState(0)
  const [orderBy, setOrderBy] = React.useState(columns[0]?.key || 'mosque')
  const [order, setOrder] = React.useState('asc')

  const handleChangePage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return
    setPage(newPage)
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedRows = React.useMemo(() => sortRows(rows, orderBy, order), [rows, orderBy, order])

  const rangeStart = page * rowsPerPage + 1
  const rangeEnd = Math.min((page + 1) * rowsPerPage, totalRows)

  // دوال مساعدة للعرض حسب نوع العمود
  const renderCellContent = (row, column) => {
    const value = row[column.key]

    // حالة خاصة لعرض بيانات المسجد كما كانت سابقًا
    if (!propColumns && column.key === 'mosque') {
      const statusStyle = getStatusStyle(row.status, colors)
      const isMaintenance = row.status === 'قيد الصيانة'
      const mutedColor = colors.mutedText

      return (
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
          <Box
            sx={{
              width: 33,
              height: 33,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: statusStyle.iconBg,
            }}
          >
            {statusStyle.icon}
          </Box>
          <Box sx={{ textAlign: 'right', paddingRight: 1 }}>
            <Typography sx={{ fontWeight: 700, color: isMaintenance ? mutedColor : colors.text }}>
              {row.mosque}
            </Typography>
            <Typography sx={{ fontSize: 12, color: isMaintenance ? mutedColor : colors.mutedText }}>
              {row.founded}
            </Typography>
          </Box>
        </Stack>
      )
    }

    // avatar: اسم + صورة (أو أحرف اسمية) + سطر فرعي إن وُجد
    if (column.type === 'avatar') {
      const parts = []
      if (row.job) parts.push(row.job)
      if (row.subtitle) parts.push(row.subtitle)
      if (row.founded) parts.push(row.founded)
      const subtitle = parts.join(' • ')

      return (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          <Avatar sx={{ width: 40, height: 40 }}>
            <PersonIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
            {subtitle ? (
              <Typography sx={{ fontSize: 11, color: colors.mutedText }}>{subtitle}</Typography>
            ) : null}
          </Box>
        </Stack>
      )
    }

    if (!propColumns && column.key === 'imam') {
      return (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          <Avatar sx={{ width: 36, height: 36 }}>
            <PersonIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
        </Stack>
      )
    }

    if (column.type === 'chip') {
      const statusStyle = getStatusStyle(value || row.status, colors)
      return (
        <Chip
          label={value || row.status}
          size="small"
          variant="outlined"
          sx={{ px: 1, ...statusStyle.chipSx }}
        />
      )
    }

    if (column.key === 'capacity' && typeof value === 'number') {
      return formatNumber(value)
    }

    return value ?? ''
  }

  return (
    <Paper
      sx={{
        p: 0,
        bgcolor: colors.surface,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
      }}
    >
      <TableContainer>
        <Table
          dir="rtl"
          sx={{ direction: 'rtl', '& .MuiTableCell-root': { borderColor: colors.border } }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
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
                    direction={orderBy === column.key ? order : 'asc'}
                    onClick={() => handleRequestSort(column.key)}
                    sx={{
                      color: colors.mutedText,
                      '&.Mui-active': { color: colors.primary },
                      '& .MuiTableSortLabel-icon': { color: `${colors.primary} !important` },
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
              const isMaintenance = row.status === 'قيد الصيانة'
              const mutedColor = colors.mutedText

              return (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:hover': { bgcolor: alpha(colors.primary, 0.04) } }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{ color: isMaintenance ? mutedColor : colors.text }}
                    >
                      {renderCellContent(row, column)}
                    </TableCell>
                  ))}

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.75}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {/* MODIFIED: كان يظهر دائماً بلا onClick لصفوف الموظفين (row.avatar ثابت دائماً) — الآن مشروط بوجود المعالج فعلياً */}
                      {row.avatar && onRowViewClick ? (
                        <Typography
                          component="a"
                          onClick={() => onRowViewClick(row)}
                          sx={{
                            color: colors.primary,
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontSize: 13,
                          }}
                        >
                          عرض التفاصيل
                        </Typography>
                      ) : null}

                      {/* MODIFIED: كل أزرار الإجراءات أصبحت مشروطة بوجود المعالج — تختفي تلقائياً بدل الظهور كزر ميت
                          (يُستخدم هذا أيضاً لإخفاء أزرار الكتابة عن المستخدمين ذوي صلاحية القراءة فقط) */}
                      {onRowEditClick ? (
                        <IconButton
                          size="small"
                          aria-label="edit"
                          onClick={() => onRowEditClick(row)}
                        >
                          <EditIcon
                            fontSize="small"
                            sx={{ color: isMaintenance ? mutedColor : colors.mutedText }}
                          />
                        </IconButton>
                      ) : null}
                      {onRowMoreClick ? (
                        <IconButton
                          size="small"
                          aria-label="more"
                          onClick={() => onRowMoreClick(row)}
                        >
                          <MoreVertIcon
                            fontSize="small"
                            sx={{ color: isMaintenance ? mutedColor : colors.mutedText }}
                          />
                        </IconButton>
                      ) : null}
                      {onRowDeleteClick ? (
                        <IconButton
                          size="small"
                          aria-label="delete"
                          onClick={() => onRowDeleteClick(row)}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ color: isMaintenance ? mutedColor : colors.mutedText }}
                          />
                        </IconButton>
                      ) : null}
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* الشريط السفلي */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 2,
          borderTop: `1px solid ${colors.border}`,
          bgcolor: alpha(colors.primary, 0.02),
        }}
      >
        <Typography
          sx={{ color: colors.mutedText, fontSize: 13 }}
        >{`عرض ${rangeStart}-${rangeEnd} من أصل ${totalRows.toLocaleString('en-US')} ${entityLabel}اً`}</Typography>

        <Box dir="ltr" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleChangePage(page + 1)}
            disabled={page === totalPages - 1}
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

          {pageIndexes.map((pageIndex) => (
            <Box
              key={pageIndex}
              onClick={() => handleChangePage(pageIndex)}
              sx={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1.25,
                border: `1px solid ${pageIndex === page ? activeTheme.layout.navActiveBorder : colors.border}`,
                bgcolor: pageIndex === page ? colors.primary : colors.surface,
                color: pageIndex === page ? colors.surface : colors.text,
                fontSize: 14,
                fontWeight: pageIndex === page ? 800 : 700,
                lineHeight: 1,
                boxShadow: pageIndex === page ? `0 0 0 1px ${alpha(colors.primary, 0.08)}` : 'none',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': {
                  bgcolor: pageIndex === page ? colors.primary : alpha(colors.primary, 0.06),
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
  )
}

export default MyTable
