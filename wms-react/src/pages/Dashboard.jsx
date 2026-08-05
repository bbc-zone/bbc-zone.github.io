import React from 'react';
import { Boxes, Factory, PackageSearch, Truck } from 'lucide-react';
import {
  getDeliveryPlanList,
  getFinalStepList,
  getItemMasterList,
  getItemReportList,
} from '../api-connection';

const emptyStatusSummary = {
  Open: 0,
  Partial: 0,
  Complete: 0,
};

function countByStatus(rows) {
  return rows.reduce(
    (summary, row) => {
      const status = row.status || 'Open';

      return {
        ...summary,
        [status]: (summary[status] || 0) + 1,
      };
    },
    { ...emptyStatusSummary }
  );
}

function sumField(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value || 0));
}

function RollingNumber({ value }) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const previousValueRef = React.useRef(0);

  React.useEffect(() => {
    const nextValue = Number(value || 0);
    const startValue = previousValueRef.current;
    const duration = 720;
    const startedAt = performance.now();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      previousValueRef.current = nextValue;
      setDisplayValue(nextValue);
      return undefined;
    }

    let animationFrameId = 0;

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (nextValue - startValue) * easedProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        previousValueRef.current = nextValue;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return formatNumber(displayValue);
}

function statusBadge(status) {
  if (status === 'Complete') {
    return 'table-badge ok';
  }

  if (status === 'Partial') {
    return 'table-badge warning';
  }

  return 'table-badge neutral';
}

export function Dashboard({ onNavigate }) {
  const [dashboardData, setDashboardData] = React.useState({
    finalSteps: [],
    deliveryPlans: [],
    stockPerItem: [],
    items: [],
  });
  const [dashboardStatus, setDashboardStatus] = React.useState('idle');
  const [dashboardError, setDashboardError] = React.useState('');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [stockItemCode, setStockItemCode] = React.useState('');
  const [stockItemSearch, setStockItemSearch] = React.useState('');
  const [stockItemSelectOpen, setStockItemSelectOpen] = React.useState(false);

  React.useEffect(() => {
    setDashboardStatus('loading');
    setDashboardError('');

    Promise.all([getFinalStepList(), getDeliveryPlanList(), getItemReportList(), getItemMasterList()])
      .then(([finalStepData, deliveryData, reportData, itemData]) => {
        setDashboardData({
          finalSteps: finalStepData.data || [],
          deliveryPlans: deliveryData.data || [],
          stockPerItem: reportData.stock_per_item || [],
          items: itemData.data || [],
        });
        setDashboardStatus('success');
      })
      .catch((error) => {
        setDashboardError(error.message || 'Failed to read dashboard data');
        setDashboardStatus('error');
      });
  }, [refreshKey]);

  const finalStepSummary = React.useMemo(() => countByStatus(dashboardData.finalSteps), [dashboardData.finalSteps]);
  const deliverySummary = React.useMemo(() => countByStatus(dashboardData.deliveryPlans), [dashboardData.deliveryPlans]);
  const availableStock = sumField(dashboardData.stockPerItem, 'available_qty');
  const openFinalSteps = finalStepSummary.Open + finalStepSummary.Partial;
  const openDeliveries = deliverySummary.Open + deliverySummary.Partial;
  const selectedStockItem = dashboardData.items.find((item) => item.item_code === stockItemCode);
  const selectedStockReport = dashboardData.stockPerItem.find((item) => item.item_code === stockItemCode);
  const filteredStockItemOptions = dashboardData.items.filter((item) => {
    const keyword = stockItemSearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return `${item.item_code} ${item.item_name}`.toLowerCase().includes(keyword);
  });

  const openStockMovementDetail = () => {
    if (!selectedStockItem) {
      return;
    }

    window.sessionStorage.setItem('wms-item-report-selected-code', selectedStockItem.item_code);
    onNavigate('item-report-list');
  };

  const metricItems = [
    {
      label: 'Final Step',
      value: openFinalSteps,
      note: 'Open & Partial plans',
      icon: Factory,
      page: 'final-step',
    },
    {
      label: 'Delivery',
      value: openDeliveries,
      note: 'Open & Partial deliveries',
      icon: Truck,
      page: 'delivery',
    },
    {
      label: 'Available Stock',
      value: availableStock,
      note: `${dashboardData.stockPerItem.length} item groups`,
      icon: Boxes,
      page: 'item-report-list',
    },
    {
      label: 'Inventory',
      titleOnly: true,
      icon: PackageSearch,
      page: 'inventory',
    },
  ];

  return (
    <>
      <section className="metrics">
        {metricItems.map((item) => {
          const Icon = item.icon;

          return (
            <button className="metric-card metric-button" key={item.label} type="button" onClick={() => onNavigate(item.page)}>
              <span>
                <Icon size={21} />
              </span>
              <div>
                {item.titleOnly ? (
                  <strong className="metric-title-only">{item.label}</strong>
                ) : (
                  <>
                    <p>{item.label}</p>
                    <strong>
                      <RollingNumber value={item.value} />
                    </strong>
                    <small>{item.note}</small>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </section>

      <section className="content-grid dashboard-grid">
        <article className="panel">
          <div className="panel-title">
            <h2>WMS Transaction</h2>
            <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>
              Refresh
            </button>
          </div>

          {dashboardStatus === 'loading' ? (
            <p className="empty-state">Reading dashboard data...</p>
          ) : dashboardStatus === 'error' ? (
            <p className="empty-state error-text">{dashboardError}</p>
          ) : (
            <div className="dashboard-summary">
              <div className="dashboard-summary-row">
                <div>
                  <strong>Final Step</strong>
                  <small>Production plan progress</small>
                </div>
                <div className="status-strip">
                  {Object.entries(finalStepSummary).map(([status, value]) => (
                    <span className={statusBadge(status)} key={status}>
                      {status}: <RollingNumber value={value} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="dashboard-summary-row">
                <div>
                  <strong>Delivery</strong>
                  <small>Delivery plan progress</small>
                </div>
                <div className="status-strip">
                  {Object.entries(deliverySummary).map(([status, value]) => (
                    <span className={statusBadge(status)} key={status}>
                      {status}: <RollingNumber value={value} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-title">
            <h2>Item Stock</h2>
          </div>

          <div className="dashboard-summary">
            <div className="select2-filter dashboard-select">
              <span>Item</span>
              <button
                className="select2-button"
                type="button"
                onClick={() => setStockItemSelectOpen((value) => !value)}
              >
                {selectedStockItem ? `${selectedStockItem.item_code} - ${selectedStockItem.item_name}` : 'Select item'}
              </button>

              {stockItemSelectOpen ? (
                <div className="select2-menu">
                  <input
                    autoFocus
                    value={stockItemSearch}
                    onChange={(event) => setStockItemSearch(event.target.value)}
                    placeholder="Search item..."
                  />
                  {filteredStockItemOptions.map((item) => (
                    <button
                      className="select2-option"
                      key={item.item_code}
                      type="button"
                      onClick={() => {
                        setStockItemCode(item.item_code);
                        setStockItemSearch('');
                        setStockItemSelectOpen(false);
                      }}
                    >
                      <strong>{item.item_code}</strong>
                      <small>{item.item_name}</small>
                    </button>
                  ))}
                  {filteredStockItemOptions.length === 0 ? (
                    <span className="select2-empty">Item was not found</span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="dashboard-summary-row">
              <div>
                <strong>Current Stock</strong>
                <small>{selectedStockItem ? selectedStockItem.item_name : 'Select item first'}</small>
              </div>
              <em>
                <RollingNumber value={selectedStockReport ? selectedStockReport.available_qty : 0} />
              </em>
            </div>

            {selectedStockItem ? (
              <div className="dashboard-card-actions">
                <button type="button" onClick={openStockMovementDetail}>
                  Detail
                </button>
              </div>
            ) : null}
          </div>
        </article>

      </section>
    </>
  );
}
