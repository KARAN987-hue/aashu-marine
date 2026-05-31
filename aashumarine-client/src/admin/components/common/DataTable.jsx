import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './DataTable.css';

export function DataTable({
  columns,
  data,
  pagination,
  onPageChange,
  onSort,
  isLoading,
  emptyMessage = 'No data available'
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (column) => {
    if (!column.sortable) return;

    const newOrder = 
      sortColumn === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
    
    setSortColumn(column.key);
    setSortOrder(newOrder);
    
    if (onSort) {
      onSort(column.key, newOrder);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="data-table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="data-table-container">
      <table className="data-table" role="table" aria-label="Data table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column)}
                className={column.sortable ? 'sortable' : ''}
                role="columnheader"
                aria-sort={
                  column.sortable && sortColumn === column.key
                    ? sortOrder === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : column.sortable
                    ? 'none'
                    : undefined
                }
                tabIndex={column.sortable ? 0 : undefined}
                onKeyDown={
                  column.sortable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSort(column);
                        }
                      }
                    : undefined
                }
              >
                {column.label}
                {column.sortable && sortColumn === column.key && (
                  <span className="sort-indicator" aria-hidden="true">
                    {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} role="cell">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <nav 
          className="data-table-pagination" 
          role="navigation" 
          aria-label="Table pagination"
        >
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span aria-live="polite" aria-atomic="true">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
