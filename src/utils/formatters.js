export const formatCurrency = (amount, currency = 'MAD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Add these missing functions
export const calculateDiscount = (total, discountPercent) => {
  return total * (discountPercent / 100)
}

export const calculateTax = (subtotal, taxRate) => {
  return subtotal * (taxRate / 100)
}