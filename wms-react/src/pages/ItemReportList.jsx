import React from 'react';
import { ArrowLeft, Eye, RefreshCw } from 'lucide-react';
import { getItemReportList } from '../api-connection';
import { DataTable } from '../components/DataTable';

function renderQty(value, type) {
  const numericValue = Number(value || 0);

  if (numericValue <= 0) {
    return <span className="qty-muted">{numericValue}</span>;
  }

  return <span className={`qty-pill ${type}`}>{numericValue}</span>;
}

export function ItemReportList() {
  const [reportStatus, setReportStatus] = React.useState('idle');
  const [reportError, setReportError] = React.useState('');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [stockPerItemRows, setStockPerItemRows] = React.useState([]);
  const [stockMovementRows, setStockMovementRows] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setReportStatus('loading');
    setReportError('');

    getItemReportList()
      .then((data) => {
        setStockPerItemRows(data.stock_per_item || []);
        setStockMovementRows(data.stock_movements || []);
        setReportStatus('success');
      })
      .catch((error) => {
        setStockPerItemRows([]);
        setStockMovementRows([]);
        setReportError(error.message || 'Failed to read item report list');
        setReportStatus('error');
      });
  }, [refreshKey]);

  const openItemMovement = (item) => {
    setSelectedItem(item);
    setSearch('');
  };

  const backToStockPerItem = () => {
    setSelectedItem(null);
    setSearch('');
  };

  const keyword = search.trim().toLowerCase();
  const filteredStockPerItemRows = stockPerItemRows.filter((row) => {
    if (!keyword) {
      return true;
    }

    return [row.item_code, row.item_name, row.available_qty]
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  const selectedItemMovements = selectedItem
    ? (() => {
        let runningBalance = Number(selectedItem.available_qty || 0);

        return stockMovementRows
          .filter((row) => row.item_code === selectedItem.item_code)
          .sort((firstRow, secondRow) => Number(secondRow.report_id || 0) - Number(firstRow.report_id || 0))
          .map((row) => {
            const rowWithBalance = {
              ...row,
              running_balance: runningBalance,
            };

            runningBalance -= Number(row.qty_balance || 0);

            return rowWithBalance;
          });
      })()
    : [];

  const stockPerItemColumns = [
    {
      key: 'item_code',
      header: 'Item Code',
    },
    {
      key: 'item_name',
      header: 'Item Name',
    },
    {
      key: 'available_qty',
      header: 'Available Stock',
    },
    {
      key: 'action',
      header: 'Action',
      sortable: false,
      render: (row) => (
        <div className="row-actions">
          <button type="button" aria-label="View stock movement" onClick={() => openItemMovement(row)}>
            <Eye size={15} />
          </button>
        </div>
      ),
    },
  ];

  const stockMovementColumns = [
    {
      key: 'unique_code',
      header: 'UniqueCode',
      sortable: false,
    },
    {
      key: 'type_name',
      header: 'Type',
      sortable: false,
      render: (row) => row.type_name || `Type ${row.type_id}`,
    },
    {
      key: 'qty_in',
      header: 'Qty In',
      sortable: false,
      render: (row) => renderQty(row.qty_in, 'qty-in'),
    },
    {
      key: 'qty_out',
      header: 'Qty Out',
      sortable: false,
      render: (row) => renderQty(row.qty_out, 'qty-out'),
    },
    {
      key: 'running_balance',
      header: 'Balance',
      sortable: false,
    },
    {
      key: 'actual_date',
      header: 'Actual Date',
      sortable: false,
      render: (row) => row.actual_date || '-',
    },
    {
      key: 'remarks',
      header: 'Remarks',
      sortable: false,
      render: (row) => row.remarks || '-',
    },
  ];

  return (
    <section className="panel">
      <div className="panel-title">
        <h2>{selectedItem ? 'Stock Movement' : 'Stock Per Item'}</h2>
        <div className="panel-actions">
          {selectedItem ? (
            <button type="button" className="secondary-button" onClick={backToStockPerItem}>
              <ArrowLeft size={16} />
              Back
            </button>
          ) : null}
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {selectedItem ? (
        <div className="readonly-plan">
          <label>
            Item Code
            <input value={selectedItem.item_code} readOnly />
          </label>
          <label>
            Item Name
            <input value={selectedItem.item_name} readOnly />
          </label>
          <label>
            Available Stock
            <input value={selectedItem.available_qty} readOnly />
          </label>
        </div>
      ) : null}

      {!selectedItem ? (
        <div className="table-filter">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search item stock..."
          />
        </div>
      ) : null}

      {reportStatus === 'loading' ? (
        <p className="empty-state">Reading item report list...</p>
      ) : reportStatus === 'error' ? (
        <p className="empty-state error-text">{reportError}</p>
      ) : selectedItem ? (
        <DataTable
          className="report-table"
          columns={stockMovementColumns}
          minWidth={840}
          rowKey={(row) => row.report_id}
          rows={selectedItemMovements}
        />
      ) : (
        <DataTable
          className="report-table"
          columns={stockPerItemColumns}
          initialSortKey="item_code"
          minWidth={860}
          rowKey={(row, index) => `${row.item_code}-${index}`}
          rows={filteredStockPerItemRows}
        />
      )}
    </section>
  );
}
