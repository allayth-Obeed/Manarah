/**
 * خدمة الصيانة والشكاوى - Maintenance Service
 * نفس نمط employeeService.js — دوال الاتصال بالـ API لإدارة تذاكر الصيانة
 */

import apiClient from './apiClient'

export const getAllTickets = async () => {
  try {
    const response = await apiClient.get('/maintenance-tickets')
    return response.data
  } catch (error) {
    console.error('خطأ في جلب تذاكر الصيانة:', error)
    throw error
  }
}

export const getTicket = async (id) => {
  try {
    const response = await apiClient.get(`/maintenance-tickets/${id}`)
    return response.data
  } catch (error) {
    console.error(`خطأ في جلب تذكرة الصيانة رقم ${id}:`, error)
    throw error
  }
}

export const createTicket = async (ticketData) => {
  try {
    const response = await apiClient.post('/maintenance-tickets', ticketData)
    return response.data
  } catch (error) {
    console.error('خطأ في إنشاء تذكرة الصيانة:', error)
    throw error
  }
}

export const updateTicket = async (id, ticketData) => {
  try {
    const response = await apiClient.patch(`/maintenance-tickets/${id}`, ticketData)
    return response.data
  } catch (error) {
    console.error(`خطأ في تحديث تذكرة الصيانة رقم ${id}:`, error)
    throw error
  }
}

export const deleteTicket = async (id) => {
  try {
    const response = await apiClient.delete(`/maintenance-tickets/${id}`)
    return response.data
  } catch (error) {
    console.error(`خطأ في حذف تذكرة الصيانة رقم ${id}:`, error)
    throw error
  }
}

export default { getAllTickets, getTicket, createTicket, updateTicket, deleteTicket }
