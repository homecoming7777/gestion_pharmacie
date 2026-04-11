import React from 'react'

const FilterBar = ({ filters, onFilterChange, activeFilter, onClear }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            activeFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {filter.label}
        </button>
      ))}
      {onClear && (
        <button onClick={onClear} className="text-sm text-gray-500 hover:text-gray-700">
          Clear
        </button>
      )}
    </div>
  )
}

export default FilterBar