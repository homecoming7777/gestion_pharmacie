import { settingsService } from '../services/settingsService'

export const formatCurrency = (amount) => {
  const settings = settingsService.get()
  const currency = settings?.currency || 'MAD'

  const symbols = {
    MAD: 'DH',
    USD: '$',
    EUR: '€',
  }

  return `${symbols[currency]} ${Number(amount || 0).toFixed(2)}`
}

export const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatShortDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

export const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('fr-FR')
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num || 0)
}

export const calculateDiscount = (subtotal, discountPercent = 0) => {
  const subtotalNumber = Number(subtotal || 0)
  const discountNumber = Number(discountPercent || 0)

  return (subtotalNumber * discountNumber) / 100
}

export const calculateTax = (amount) => {
  const settings = settingsService.get()
  const taxRate = Number(settings?.taxRate || 0)

  return (Number(amount || 0) * taxRate) / 100
}

export const calculateTotal = (subtotal, discountPercent = 0) => {
  const discount = calculateDiscount(subtotal, discountPercent)
  const afterDiscount = Number(subtotal || 0) - discount
  const tax = calculateTax(afterDiscount)

  return afterDiscount + tax
}