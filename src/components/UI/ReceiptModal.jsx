import React, { useRef } from 'react'
import { Printer, X } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatters'

const ReceiptModal = ({ isOpen, onClose, sale }) => {
  const receiptRef = useRef()

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContent
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  if (!sale) return null

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <div
            className="fixed top-1/2 left-1/2 transform text-black -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Sale Receipt</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 rounded-lg hover:bg-gray-100">
                  <Printer className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div ref={receiptRef} className="p-6 font-mono text-sm">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">Pharmacy PMS</h3>
                <p>123 Health Street, Medical City</p>
                <p>Tel: +1 234 567 890</p>
                <p className="text-xs mt-2">Invoice #{sale.invoiceNumber}</p>
              </div>
              <div className="border-t border-b py-2 my-2">
                <p>Date: {formatDate(sale.date)}</p>
                <p>Patient: {sale.patientName || 'Walk-in Customer'}</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1">{item.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">{formatCurrency(item.price)}</td>
                      <td className="text-right">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(sale.subtotal)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-{formatCurrency(sale.discount)}</span>
                  </div>
                )}
                {sale.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(sale.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-1 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(sale.total)}</span>
                </div>
              </div>
              <div className="text-center text-xs mt-4">
                <p>Thank you for your purchase!</p>
                <p>Follow us on social media</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ReceiptModal