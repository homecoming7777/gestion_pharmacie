export const generateBarcode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export const calculateDiscount = (total, discountPercent) => {
  return total * (discountPercent / 100)
}

export const calculateTax = (subtotal, taxRate) => {
  return subtotal * (taxRate / 100)
}

export const exportToCSV = (data, filename) => {
  const csv = data.map(row => Object.values(row).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}