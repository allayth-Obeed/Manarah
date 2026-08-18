/**
 * أدوات تصدير جداول البيانات إلى Excel وPDF — تعمل بالكامل على الفرونت اند من البيانات المعروضة فعلياً
 * (rows/columns بنفس تنسيق MyTable: columns = [{ key, label }], rows = [{ [key]: قيمة نصية جاهزة للعرض }])
 */

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// تصدير Excel حقيقي (.xlsx) — يبني ورقة عمل من الأعمدة/الصفوف المعروضة مع اتجاه RTL
export const exportRowsToExcel = (rows, columns, filename = 'تقرير') => {
  const data = rows.map((row) => {
    const record = {}
    columns.forEach((col) => {
      record[col.label] = row[col.key] ?? ''
    })
    return record
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  // اتجاه الورقة من اليمين لليسار ليطابق محتواها العربي
  workbook.Workbook = { Views: [{ RTL: true }] }
  XLSX.utils.book_append_sheet(workbook, worksheet, 'البيانات')
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

// يبني جدول HTML مؤقت (خارج الشاشة) بنفس شكل التقرير المطلوب تصويره لملف PDF
const buildPrintableTable = (rows, columns, title) => {
  const container = document.createElement('div')
  container.dir = 'rtl'
  container.style.position = 'fixed'
  container.style.top = '-10000px' // خارج نطاق الرؤية بدل display:none حتى يستطيع html2canvas قياسه وتصويره
  container.style.left = '-10000px'
  container.style.width = '900px'
  container.style.padding = '24px'
  container.style.backgroundColor = '#ffffff'
  container.style.fontFamily = '"IBM Plex Sans Arabic", Tahoma, sans-serif'
  container.style.color = '#111827'

  const heading = document.createElement('div')
  heading.style.marginBottom = '16px'
  heading.style.textAlign = 'center'
  heading.innerHTML = `
    <div style="font-size:20px;font-weight:700;color:#1a4a33;">مديرية الأوقاف — ${title}</div>
    <div style="font-size:12px;color:#6b7280;margin-top:4px;">تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
  `
  container.appendChild(heading)

  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  table.style.fontSize = '13px'

  const thead = document.createElement('thead')
  const headRow = document.createElement('tr')
  columns.forEach((col) => {
    const th = document.createElement('th')
    th.textContent = col.label
    th.style.border = '1px solid #d1d5db'
    th.style.padding = '8px 10px'
    th.style.backgroundColor = '#1a4a33'
    th.style.color = '#ffffff'
    th.style.textAlign = 'right'
    headRow.appendChild(th)
  })
  thead.appendChild(headRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  rows.forEach((row, idx) => {
    const tr = document.createElement('tr')
    tr.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f3f4f6'
    columns.forEach((col) => {
      const td = document.createElement('td')
      td.textContent = row[col.key] ?? ''
      td.style.border = '1px solid #d1d5db'
      td.style.padding = '7px 10px'
      td.style.textAlign = 'right'
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)
  container.appendChild(table)

  document.body.appendChild(container)
  return container
}

// تصدير PDF عبر تصوير جدول HTML حقيقي (يحل مشكلة عدم دعم jsPDF لتشكيل الحروف العربية بالنص المباشر)
export const exportRowsToPdf = async (rows, columns, title = 'تقرير', filename = 'تقرير') => {
  const container = buildPrintableTable(rows, columns, title)

  try {
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${filename}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}
