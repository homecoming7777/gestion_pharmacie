import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Minus, Trash2 } from 'lucide-react'
import { medicineService } from '../services/medicineService'
import { patientService } from '../services/patientService'
import { saleService } from '../services/saleService'
import { inventoryService } from '../services/inventoryService'
import { settingsService } from '../services/settingsService'
import ConfirmDialog from '../components/UI/ConfirmDialog'
import ReceiptModal from '../components/UI/ReceiptModal'
import { formatCurrency, calculateTax, calculateDiscount } from '../utils/formatters'
import { PAYMENT_METHODS } from '../utils/constants'
import toast from 'react-hot-toast'

const POS = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [medicines, setMedicines] = useState([])
  const [cart, setCart] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [showPrescriptionWarning, setShowPrescriptionWarning] = useState(null)
  const [showReceipt, setShowReceipt] = useState(null)
  const barcodeInputRef = useRef(null)
  const settings = settingsService.get()
  
  useEffect(() => {
    loadMedicines()
    loadPatients()
    barcodeInputRef.current?.focus()
  }, [])
  
  const loadMedicines = () => {
    const data = medicineService.getAll()
    setMedicines(data.filter(m => m.stock > 0))
  }
  
  const loadPatients = () => {
    const data = patientService.getAll()
    setPatients(data)
  }
  
  const handleBarcodeScan = (e) => {
    if (e.key === 'Entrer') {
      const medicine = medicines.find(m => m.barcode === searchQuery)
      if (medicine) {
        addToCart(medicine)
        setSearchQuery('')
      } else {
        toast.error('Médicament non trouvé')
      }
    }
  }
  
  const addToCart = (medicine) => {
    if (medicine.prescriptionRequired && !selectedPatient) {
      setShowPrescriptionWarning(medicine)
      return
    }
    
    const existingItem = cart.find(item => item.id === medicine.id)
    if (existingItem) {
      if (existingItem.quantity + 1 > medicine.stock) {
        toast.error('Pas assez de stock disponible')
        return
      }
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      if (medicine.stock < 1) {
        toast.error('Hors de stock')
        return
      }
      setCart([...cart, { ...medicine, quantity: 1 }])
    }
    toast.success(`${medicine.name} ajouté au panier`)
  }
  
  const updateQuantity = (itemId, delta) => {
    const item = cart.find(i => i.id === itemId)
    const newQuantity = item.quantity + delta
    
    if (newQuantity < 1) {
      removeFromCart(itemId)
      return
    }
    
    if (newQuantity > item.stock) {
      toast.error('Pas assez de stock disponible')
      return
    }
    
    setCart(cart.map(i =>
      i.id === itemId ? { ...i, quantity: newQuantity } : i
    ))
  }
  
  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => i.id !== itemId))
  }
  
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0)
  }
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = calculateDiscount(subtotal, discount)
    const taxAmount = calculateTax(subtotal - discountAmount, settings.taxRate)
    return subtotal - discountAmount + taxAmount
  }
  
  const handleConfirmSale = async () => {
    if (cart.length === 0) {
      toast.error('Le panier est vide')
      return
    }
    
    const subtotal = calculateSubtotal()
    const discountAmount = calculateDiscount(subtotal, discount)
    const taxAmount = calculateTax(subtotal - discountAmount, settings.taxRate)
    const total = subtotal - discountAmount + taxAmount
    
    const sale = {
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.fullName || 'Client walk-in',
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.sellPrice,
      })),
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paymentMethod,
      status: 'completed',
    }
    
    const newSale = saleService.create(sale)
    
    cart.forEach(item => {
      medicineService.updateStock(item.id, item.quantity, 'subtract')
      inventoryService.createMovement({
        medicineId: item.id,
        type: 'OUT',
        quantity: item.quantity,
        reason: 'POS Sale',
        date: new Date().toISOString(),
      })
    })
    
    if (selectedPatient) {
      patientService.addPurchase(selectedPatient.id, newSale)
    }
    
    toast.success('Vente conclue avec succès!')
    setShowReceipt(newSale)
    resetPOS()
  }
  
  const resetPOS = () => {
    setCart([])
    setSelectedPatient(null)
    setDiscount(0)
    setPaymentMethod('Cash')
    loadMedicines()
    barcodeInputRef.current?.focus()
  }
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="lg:w-2/3 space-y-4">
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={barcodeInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleBarcodeScan}
              placeholder="Scannez le code-barres ou recherchez le nom du médicament..."
              className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicines.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.barcode?.includes(searchQuery)
          ).slice(0, 20).map(medicine => (
            <div key={medicine.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{medicine.name}</h3>
                  <p className="text-sm text-gray-500">{medicine.category}</p>
                  <p className="text-lg font-bold mt-2">{formatCurrency(medicine.sellPrice)}</p>
                  <p className="text-xs text-gray-500">Stock: {medicine.stock}</p>
                </div>
                <button
                  onClick={() => addToCart(medicine)}
                  className="btn-primary py-1 px-3 text-sm"
                  disabled={medicine.stock === 0}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="lg:w-1/3 sticky top-4 h-fit">
        <div className="card space-y-4">
          <h2 className="text-xl font-bold">Panier</h2>
          
          <div>
            <label className="label">Patient</label>
            <select
              className="input"
              value={selectedPatient?.id || ''}
              onChange={(e) => {
                const patient = patients.find(p => p.id === e.target.value)
                setSelectedPatient(patient)
              }}
            >
              <option value="">Walk-in Client</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.fullName}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(item.sellPrice)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {cart.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Le panier est vide.
            </div>
          )}
          
          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rabais (%):</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 px-2 py-1 border rounded text-right"
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex justify-between">
                <span>Impôt ({settings.taxRate}%):</span>
                <span>{formatCurrency(calculateTax(calculateSubtotal() - calculateDiscount(calculateSubtotal(), discount), settings.taxRate))}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              
              <div>
                <label className="label">Méthode de paiement</label>
                <select
                  className="input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              <button onClick={handleConfirmSale} className="btn-primary w-full py-3">
                Confirmer la vente
              </button>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={!!showPrescriptionWarning}
        onClose={() => setShowPrescriptionWarning(null)}
        onConfirm={() => {
          toast.error('Ce médicament nécessite une ordonnance. Veuillez dabord sélectionner un patient..')
          setShowPrescriptionWarning(null)
        }}
        title="Ordonnance requise"
        message={`${showPrescriptionWarning?.name} Ce médicament nécessite une ordonnance. Veuillez sélectionner un patient avant de l'ajouter..`}
      />
      
      <ReceiptModal
        isOpen={!!showReceipt}
        onClose={() => setShowReceipt(null)}
        sale={showReceipt}
      />
    </div>
  )
}

export default POS  