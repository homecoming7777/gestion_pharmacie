import React from 'react'

const BadgeStatus = ({ status }) => {
  const variants = {
    normal: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    expired: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    in: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    out: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    adjustment: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[status] || variants.normal}`}>
      {status.toUpperCase()}
    </span>
  )
}

export default BadgeStatus