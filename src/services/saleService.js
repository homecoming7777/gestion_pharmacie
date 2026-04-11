import { storage, STORAGE_KEYS } from './localStorage'
import { v4 as uuidv4 } from 'uuid'

export const saleService = {
  getAll: () => {
    return storage.get(STORAGE_KEYS.SALES) || []
  },
  
  getById: (id) => {
    const sales = saleService.getAll()
    return sales.find(s => s.id === id)
  },
  
  create: (sale) => {
    const sales = saleService.getAll()
    const newSale = {
      id: uuidv4(),
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      ...sale,
    }
    sales.unshift(newSale)
    storage.set(STORAGE_KEYS.SALES, sales)
    return newSale
  },
  
  getTodaySales: () => {
    const sales = saleService.getAll()
    const today = new Date().toDateString()
    return sales.filter(s => new Date(s.date).toDateString() === today)
  },
  
  getSalesByDateRange: (startDate, endDate) => {
    const sales = saleService.getAll()
    return sales.filter(s => {
      const saleDate = new Date(s.date)
      return saleDate >= startDate && saleDate <= endDate
    })
  },
  
  getTotalRevenue: () => {
    const sales = saleService.getAll()
    return sales.reduce((sum, sale) => sum + sale.total, 0)
  },
}