import React from 'react'

const ChartCard = ({ title, children }) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-80">
        {children}
      </div>
    </div>
  )
}

export default ChartCard