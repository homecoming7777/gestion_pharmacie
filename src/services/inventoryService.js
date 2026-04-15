import { storage, STORAGE_KEYS } from './localStorage'
import { v4 as uuidv4 } from 'uuid'
import { medicineService } from './medicineService'

export const inventoryService = {
  getAllMovements: () => {
    return storage.get(STORAGE_KEYS.INVENTORY_MOVEMENTS) || []
  },
  
  createMovement: (movement) => {
    const movements = inventoryService.getAllMovements()
    const medicine = medicineService.getById(movement.medicineId)
    
    if (!medicine) return null
    
    const oldStock = medicine.stock
    let newStock = oldStock
    
    switch (movement.type) {
      case 'IN':
        newStock = oldStock + movement.quantity
        break
      case 'OUT':
        newStock = Math.max(0, oldStock - movement.quantity)
        break
      case 'ADJUSTMENT':
        newStock = movement.quantity
        break
    }
    
    
    medicineService.updateStock(movement.medicineId, movement.quantity, movement.type === 'IN' ? 'add' : 'subtract')
    
    const newMovement = {
      id: uuidv4(),
      date: new Date().toISOString(),
      oldStock,
      newStock,
      ...movement,
    }
    
    movements.unshift(newMovement)
    storage.set(STORAGE_KEYS.INVENTORY_MOVEMENTS, movements)
    return newMovement
  },
  
  getMovementsByMedicine: (medicineId) => {
    const movements = inventoryService.getAllMovements()
    return movements.filter(m => m.medicineId === medicineId)
  },
}