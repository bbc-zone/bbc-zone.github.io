import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return value;
}

function compareValues(firstValue, secondValue) {
  const first = normalizeValue(firstValue);
  const second = normalizeValue(secondValue);

  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }

  return String(first).localeCompare(String(second), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function DataTable({
  columns,
  emptyText = 'Data tidak ditemukan',
  initialSortDirection = 'asc',
  initialSortKey,
  minWidth = 900,
  pageSizeOptions = [10, 25, 50, 100],
  rowKey,
  rows,
}) {
  const [sortConfig, setSortConfig] = React.useState({
    key: initialSortKey || '',
    direction: initialSortDirection,
  });
  const [pageSize, setPageSize] = React.useState(pageSizeOptions[0]);
  const [page, setPage] = React.useState(1);

  const sortedRows = React.useMemo(() => {
    if (!sortConfig.key) {
      return rows;
    }

    const column = columns.find((item) => item.key === sortConfig.key);

    if (!column) {
      return rows;
    }

    return [...rows].sort((firstRow, secondRow) => {
      const firstValue = column.sortValue ? column.sortValue(firstRow) : firstRow[column.key];
      const secondValue = column.sortValue ? column.sortValue(secondRow) : secondRow[column.key];
      const result = compareValues(firstValue, secondValue);

      return sortConfig.direction === 'asc' ? result : result * -1;
    });
  }, [columns, rows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = sortedRows.length === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedRows.length);
  const visibleRows = sortedRows.slice(startIndex, endIndex);

  React.useEffect(() => {
    setPage(1);
  }, [rows, pageSize, sortConfig.key, sortConfig.direction]);

  const changeSort = (column) => {
    if (column.sortable === false) {
      return;
    }

    setSortConfig((current) => {
      if (current.key !== column.key) {
        return {
          key: column.key,
          direction: 'asc',
        };
      }

      return {
        key: column.key,
        direction: current.direction === 'asc' ? 'desc' : 'asc',
      };
    });
  };

  const getSortIcon = (column) => {
    if (column.sortable === false) {
      return null;
    }

    if (sortConfig.key !== column.key) {
      return <ArrowUpDown size={14} />;
    }

    return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const renderCell = (column, row, index) => (column.render ? column.render(row, index) : row[column.key]);

  return (
    <div className="datatable">
      <div className="datatable-top">
        <label>
          Show
          <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          rows
        </label>
        <span>{sortedRows.length} data</span>
      </div>

      <div className="data-table-wrap">
        <table className="data-table" style={{ minWidth }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.sortable === false ? (
                    column.header
                  ) : (
                    <button type="button" onClick={() => changeSort(column)}>
                      <span>{column.header}</span>
                      {getSortIcon(column)}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr key={rowKey(row, startIndex + index)}>
                {columns.map((column) => (
                  <td key={column.key}>{renderCell(column, row, startIndex + index)}</td>
                ))}
              </tr>
            ))}
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>{emptyText}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="data-card-list">
        {visibleRows.map((row, index) => (
          <article className="data-card-row" key={rowKey(row, startIndex + index)}>
            {columns.map((column) => (
              <div
                className={column.key === 'action' ? 'data-card-field action-field' : 'data-card-field'}
                key={column.key}
              >
                <span>{column.header}</span>
                <div>{renderCell(column, row, startIndex + index)}</div>
              </div>
            ))}
          </article>
        ))}
        {visibleRows.length === 0 ? <p className="data-card-empty">{emptyText}</p> : null}
      </div>

      <div className="datatable-bottom">
        <span>
          Showing {sortedRows.length === 0 ? 0 : startIndex + 1} to {endIndex} of {sortedRows.length}
        </span>
        <div className="datatable-pager">
          <button type="button" disabled={safePage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            <ChevronLeft size={16} />
            Prev
          </button>
          <span>
            Page {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
