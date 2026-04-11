import { saleService } from './saleService'
import { medicineService } from './medicineService'
import { patientService } from './patientService'
import { supplierService } from './supplierService'

export const dashboardService = {
  getStats: () => {
    const todaySales = saleService.getTodaySales()
    const totalSalesToday = todaySales.length
    const revenueToday = todaySales.reduce((sum, sale) => sum + sale.total, 0)
    const lowStock = medicineService.getLowStock().length
    const expiringSoon = medicineService.getExpiringSoon(30).length
    const totalPatients = patientService.getAll().length
    const totalSuppliers = supplierService.getAll().length
    
    return {
      totalSalesToday,
      revenueToday,
      lowStock,
      expiringSoon,
      totalPatients,
      totalSuppliers,
    }
  },
  
  getRecentSales: (limit = 5) => {
    const sales = saleService.getAll()
    return sales.slice(0, limit)
  },
  
  getTopMedicines: (limit = 5) => {
    const sales = saleService.getAll()
    const medicineSales = {}
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!medicineSales[item.id]) {
          medicineSales[item.id] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          }
        }
        medicineSales[item.id].quantity += item.quantity
        medicineSales[item.id].revenue += item.price * item.quantity
      })
    })
    
    return Object.values(medicineSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit)
  },
  
  getLatestStockMovements: (limit = 5) => {
    const { inventoryService } = require('./inventoryService')
    const movements = inventoryService.getAllMovements()
    return movements.slice(0, limit)
  },
}