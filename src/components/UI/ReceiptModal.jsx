import React, { useRef } from 'react'
import { Printer, X } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useSettings } from '../../contexts/SettingsContext'

const ReceiptModal = ({ isOpen, onClose, sale }) => {
  const receiptRef = useRef()
  const { settings } = useSettings()

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=700')

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${sale.invoiceNumber}</title>
          <style>
            body {
              font-family: monospace;
              padding: 20px;
              color: black;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            th, td {
              padding: 4px 0;
              text-align: left;
            }
            .right {
              text-align: right;
            }
            .center {
              text-align: center;
            }
            .border-top {
              border-top: 1px solid #000;
              margin-top: 10px;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          ${receiptRef.current.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  if (!sale || !isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 transform text-black -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Ticket de vente</h2>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Printer className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={receiptRef} className="p-6 font-mono text-sm">
          <div className="text-center mb-4">
            {settings.showLogo && (
              <div className="mb-2 text-lg font-bold">💊</div>
            )}

            <h3 className="font-bold text-lg">
              {settings.pharmacyName}
            </h3>

            <p>{settings.pharmacyAddress}</p>
            <p>Tel: {settings.pharmacyPhone}</p>
            <p>{settings.pharmacyEmail}</p>

            <p className="text-xs mt-2">
              Facture #{sale.invoiceNumber}
            </p>
          </div>

          <div className="border-t border-b py-2 my-2">
            <p>Date: {formatDate(sale.date)}</p>
            <p>
              Patient:{' '}
              {sale.patientName || 'Client de passage'}
            </p>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Article</th>
                <th className="text-center">Qté</th>
                <th className="text-right">Prix</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {sale.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1">{item.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t pt-2 mt-2 space-y-1">
            <div className="flex justify-between">
              <span>Sous-total:</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>

            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span>Remise:</span>
                <span>-{formatCurrency(sale.discount)}</span>
              </div>
            )}

            {sale.tax > 0 && (
              <div className="flex justify-between">
                <span>TVA:</span>
                <span>{formatCurrency(sale.tax)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold pt-1 border-t">
              <span>Total:</span>
              <span>{formatCurrency(sale.total)}</span>
            </div>
          </div>

          <div className="text-center text-xs mt-4">
            <p>{settings.receiptFooter}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReceiptModal