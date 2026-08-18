import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import MainFun from '../DashboardPage/MainFun'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import MaintenanceHeader from './MaintenanceHeader'
import MyTable from '../MosquesPage/MyTable'
import MaintenanceDialogs from '../../components/Dialogs/MaintenanceDialogs'
import ExportMenu from '../../components/common/ExportMenu'

import { getAllTickets, createTicket, updateTicket, deleteTicket } from '../../services/maintenanceService'
import { getAllMosques } from '../../services/mosqueService'
import { getAllEmployees } from '../../services/employeeService'
import { useCurrentUser } from '../../context/userContext'

const priorityLabels = { LOW: 'منخفضة', MEDIUM: 'متوسطة', HIGH: 'عالية' }
const statusLabels = { OPEN: 'مفتوحة', IN_PROGRESS: 'قيد المعالجة', RESOLVED: 'تم الحل', CLOSED: 'مغلقة' }

const ticketColumns = [
  { key: 'title', label: 'العنوان', align: 'right' },
  { key: 'mosqueName', label: 'المسجد', align: 'right' },
  { key: 'priorityLabel', label: 'الأولوية', type: 'chip', align: 'center' },
  { key: 'statusLabel', label: 'الحالة', type: 'chip', align: 'center' },
  { key: 'assignedToName', label: 'المسؤول', align: 'right' },
  { key: 'createdAtLabel', label: 'تاريخ الإبلاغ', align: 'center' },
]

const initialTicketForm = { title: '', description: '', mosqueId: '', priority: 'MEDIUM', reportedBy: '' }

const transformTicketsToRows = (tickets) =>
  tickets.map((t) => ({
    id: t.id,
    avatar: true, // ADDED: يفعّل رابط "عرض التفاصيل" بمكوّن MyTable المشترك
    title: t.title,
    mosqueName: t.mosque?.name || '—',
    priorityLabel: priorityLabels[t.priority] || t.priority,
    statusLabel: statusLabels[t.status] || t.status,
    assignedToName: t.assignedTo ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}` : 'غير مُسند',
    createdAtLabel: t.createdAt
      ? new Date(t.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
      : '—',
  }))

export default function Maintenance() {
  const { canWrite } = useCurrentUser()

  const [addOpen, setAddOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null) // التذكرة الخام الكاملة من الـ API
  const [editForm, setEditForm] = useState(null)

  const [ticketForm, setTicketForm] = useState(initialTicketForm)

  const [tickets, setTickets] = useState([])
  const [mosques, setMosques] = useState([])
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [ticketsData, mosquesData, employeesData] = await Promise.all([
        getAllTickets(),
        getAllMosques(),
        getAllEmployees(),
      ])
      setTickets(ticketsData)
      setMosques(mosquesData)
      setEmployees(employeesData)
      setError(null)
    } catch (err) {
      console.error('خطأ في جلب بيانات الصيانة:', err)
      setError('فشل في جلب بيانات تذاكر الصيانة')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleAddSubmit = async (e) => {
    e?.preventDefault()
    try {
      await createTicket({
        title: ticketForm.title,
        description: ticketForm.description || undefined,
        mosqueId: Number(ticketForm.mosqueId),
        priority: ticketForm.priority || undefined,
        reportedBy: ticketForm.reportedBy || undefined,
      })

      const updated = await getAllTickets()
      setTickets(updated)

      setAddOpen(false)
      setTicketForm(initialTicketForm)
      setError(null)
    } catch (err) {
      console.error('خطأ في فتح التذكرة:', err)
      const msg = err?.response?.data?.message
      setError(Array.isArray(msg) ? msg.join('، ') : msg || 'فشل في فتح التذكرة')
    }
  }

  const handleUpdateSubmit = async () => {
    if (!selectedTicket || !editForm) return
    try {
      await updateTicket(selectedTicket.id, {
        status: editForm.status,
        assignedToId: editForm.assignedToId === '' ? undefined : Number(editForm.assignedToId),
      })

      const updated = await getAllTickets()
      setTickets(updated)

      setDetailsOpen(false)
      setError(null)
    } catch (err) {
      console.error('خطأ في تحديث التذكرة:', err)
      setError('فشل في تحديث التذكرة')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteTicket(selectedTicket.id)
      const updated = await getAllTickets()
      setTickets(updated)
      setDeleteOpen(false)
      setSelectedTicket(null)
      setError(null)
    } catch (err) {
      console.error('خطأ في حذف التذكرة:', err)
      setError('فشل في حذف التذكرة')
    }
  }

  const rows = transformTicketsToRows(tickets)

  return (
    <div>
      <MainFun
        title="الصيانة والشكاوى"
        description="تتبع الأعطال والشكاوى المُبلَّغ عنها بكل مسجد، وإسنادها للموظفين حتى إغلاقها."
        addButton="فتح تذكرة جديدة"
        addIcon={<BuildOutlinedIcon />}
        onAddClick={() => setAddOpen(true)}
        showAddButton={true}
        showAnnouncementButton={false}
      />

      <MaintenanceHeader tickets={tickets} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 4, mb: 1 }}>
        <ExportMenu rows={rows} columns={ticketColumns} title="تقرير تذاكر الصيانة والشكاوى" filename="maintenance_report" />
      </Box>

      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>جارٍ تحميل بيانات الصيانة...</div>
      )}

      {error && !loading && (
        <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>{error}</div>
      )}

      {!loading && (
        <MyTable
          rows={rows}
          columns={ticketColumns}
          totalRows={rows.length}
          totalPages={1}
          entityLabel="تذكرة"
          onRowViewClick={(row) => {
            const raw = tickets.find((t) => t.id === row.id)
            setSelectedTicket(raw)
            setEditForm({ status: raw.status, assignedToId: raw.assignedToId || '' })
            setDetailsOpen(true)
          }}
          onRowDeleteClick={
            canWrite
              ? (row) => {
                  setSelectedTicket(tickets.find((t) => t.id === row.id))
                  setDeleteOpen(true)
                }
              : undefined
          }
        />
      )}

      <MaintenanceDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        ticketForm={ticketForm}
        setTicketForm={setTicketForm}
        handleAddSubmit={handleAddSubmit}
        mosques={mosques}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        selectedRow={selectedTicket}
        editForm={editForm}
        setEditForm={setEditForm}
        handleUpdateSubmit={handleUpdateSubmit}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        handleConfirmDelete={handleConfirmDelete}
        employees={employees}
        canWrite={canWrite}
      />
    </div>
  )
}
