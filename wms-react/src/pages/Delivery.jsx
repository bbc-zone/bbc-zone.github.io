import React from 'react';
import { ClipboardCheck, Edit, Plus, Save, Trash2, X } from 'lucide-react';
import {
  createDeliveryPlan,
  deleteDeliveryPlan,
  getDeliveryPlanList,
  getItemMasterList,
  updateDeliveryPlan,
} from '../api-connection';
import { DataTable } from '../components/DataTable';

const emptyDeliveryForm = {
  deliv_id: null,
  item_code: '',
  delivery_code: '',
  delivery_date: '',
  customer: '',
  delivery_qty: 0,
};

const deliveryFilterStorageKey = 'wms-delivery-filters';

function getStatusBadgeClass(status) {
  if (status === 'Complete') {
    return 'table-badge ok';
  }

  if (status === 'Partial') {
    return 'table-badge warning';
  }

  return 'table-badge neutral';
}

function getDateStringWithOffset(dayOffset) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getStoredDeliveryFilters() {
  try {
    const storedValue = window.sessionStorage.getItem(deliveryFilterStorageKey);

    return storedValue ? JSON.parse(storedValue) : {};
  } catch {
    return {};
  }
}

export function Delivery({ onOpenDeliveryActual }) {
  const storedFilters = React.useMemo(() => getStoredDeliveryFilters(), []);
  const defaultStartDate = React.useMemo(() => getDateStringWithOffset(-7), []);
  const defaultEndDate = React.useMemo(() => getDateStringWithOffset(7), []);
  const [deliveryPlans, setDeliveryPlans] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [deliveryStatus, setDeliveryStatus] = React.useState('idle');
  const [deliveryError, setDeliveryError] = React.useState('');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [deliveryForm, setDeliveryForm] = React.useState(emptyDeliveryForm);
  const [deliveryFormOpen, setDeliveryFormOpen] = React.useState(false);
  const [deliverySaving, setDeliverySaving] = React.useState(false);
  const [filterStartDate, setFilterStartDate] = React.useState(storedFilters.filterStartDate || defaultStartDate);
  const [filterEndDate, setFilterEndDate] = React.useState(storedFilters.filterEndDate || defaultEndDate);
  const [filterItemCode, setFilterItemCode] = React.useState(storedFilters.filterItemCode || '');
  const [filterStatus, setFilterStatus] = React.useState(storedFilters.filterStatus || 'open-partial');
  const [deliverySearch, setDeliverySearch] = React.useState(storedFilters.deliverySearch || '');
  const [itemCodeSearch, setItemCodeSearch] = React.useState('');
  const [itemCodeFilterOpen, setItemCodeFilterOpen] = React.useState(false);

  React.useEffect(() => {
    setDeliveryStatus('loading');
    setDeliveryError('');

    Promise.all([getDeliveryPlanList(), getItemMasterList()])
      .then(([deliveryData, itemData]) => {
        setDeliveryPlans(deliveryData.data || []);
        setItems((itemData.data || []).filter((item) => item.is_active));
        setDeliveryStatus('success');
      })
      .catch((error) => {
        setDeliveryPlans([]);
        setDeliveryError(error.message || 'Gagal membaca delivery plan');
        setDeliveryStatus('error');
      });
  }, [refreshKey]);

  React.useEffect(() => {
    window.sessionStorage.setItem(
      deliveryFilterStorageKey,
      JSON.stringify({
        filterStartDate,
        filterEndDate,
        filterItemCode,
        filterStatus,
        deliverySearch,
      })
    );
  }, [filterStartDate, filterEndDate, filterItemCode, filterStatus, deliverySearch]);

  const resetDeliveryForm = () => {
    setDeliveryForm(emptyDeliveryForm);
    setDeliveryFormOpen(false);
    setDeliveryError('');
  };

  const startCreateDelivery = () => {
    setDeliveryForm({
      ...emptyDeliveryForm,
      delivery_date: getDateStringWithOffset(0),
    });
    setDeliveryFormOpen(true);
    setDeliveryError('');
  };

  const startEditDelivery = (deliveryPlan) => {
    setDeliveryForm({
      deliv_id: deliveryPlan.deliv_id,
      item_code: deliveryPlan.item_code,
      delivery_code: deliveryPlan.delivery_code,
      delivery_date: deliveryPlan.delivery_date || '',
      customer: deliveryPlan.customer,
      delivery_qty: deliveryPlan.delivery_qty,
    });
    setDeliveryFormOpen(true);
    setDeliveryError('');
  };

  const updateDeliveryFormValue = (event) => {
    const { name, value } = event.target;
    setDeliveryForm((current) => ({
      ...current,
      [name]: name === 'delivery_qty' ? Number(value) : value,
    }));
  };

  const saveDeliveryPlan = (event) => {
    event.preventDefault();
    setDeliverySaving(true);
    setDeliveryError('');

    const action = deliveryForm.deliv_id ? updateDeliveryPlan(deliveryForm) : createDeliveryPlan(deliveryForm);

    action
      .then(() => {
        resetDeliveryForm();
        setRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setDeliveryError(error.message || 'Gagal menyimpan delivery plan');
      })
      .finally(() => {
        setDeliverySaving(false);
      });
  };

  const removeDeliveryPlan = (deliveryPlan) => {
    const confirmed = window.confirm(`Hapus delivery plan ${deliveryPlan.delivery_code}?`);

    if (!confirmed) {
      return;
    }

    setDeliveryError('');

    deleteDeliveryPlan(deliveryPlan.deliv_id)
      .then(() => {
        setRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setDeliveryError(error.message || 'Gagal menghapus delivery plan');
      });
  };

  const selectedItem = items.find((item) => item.item_code === deliveryForm.item_code);
  const filteredItemCodeOptions = items.filter((item) => {
    const keyword = itemCodeSearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return `${item.item_code} ${item.item_name}`.toLowerCase().includes(keyword);
  });

  const filteredDeliveryPlans = deliveryPlans.filter((deliveryPlan) => {
    const keyword = deliverySearch.trim().toLowerCase();
    const matchStartDate =
      !filterStartDate || (deliveryPlan.delivery_date && deliveryPlan.delivery_date >= filterStartDate);
    const matchEndDate = !filterEndDate || (deliveryPlan.delivery_date && deliveryPlan.delivery_date <= filterEndDate);
    const matchItemCode = !filterItemCode || deliveryPlan.item_code === filterItemCode;
    const deliveryStatusValue = deliveryPlan.status || 'Open';
    const matchStatus =
      !filterStatus ||
      (filterStatus === 'open-partial'
        ? ['Open', 'Partial'].includes(deliveryStatusValue)
        : deliveryStatusValue === filterStatus);
    const matchDate = matchStartDate && matchEndDate;

    if (!keyword) {
      return matchDate && matchItemCode && matchStatus;
    }

    const searchableText = [
      deliveryPlan.delivery_code,
      deliveryPlan.delivery_date,
      deliveryPlan.item_code,
      deliveryPlan.item_name,
      deliveryPlan.customer,
      String(deliveryPlan.delivery_qty),
    ]
      .join(' ')
      .toLowerCase();

    return matchDate && matchItemCode && matchStatus && searchableText.includes(keyword);
  });

  const clearFilters = () => {
    setFilterStartDate(defaultStartDate);
    setFilterEndDate(defaultEndDate);
    setFilterItemCode('');
    setFilterStatus('open-partial');
    setDeliverySearch('');
    setItemCodeSearch('');
    setItemCodeFilterOpen(false);
    window.sessionStorage.removeItem(deliveryFilterStorageKey);
  };

  const deliveryColumns = [
    {
      key: 'delivery_code',
      header: 'Delivery No',
    },
    {
      key: 'delivery_date',
      header: 'Delivery Date',
      render: (deliveryPlan) => deliveryPlan.delivery_date || '-',
    },
    {
      key: 'item_code',
      header: 'Item Code',
    },
    {
      key: 'item_name',
      header: 'Item Name',
    },
    {
      key: 'customer',
      header: 'Customer',
    },
    {
      key: 'delivery_qty',
      header: 'Delivery Qty',
    },
    {
      key: 'status',
      header: 'Status',
      render: (deliveryPlan) => (
        <span className={getStatusBadgeClass(deliveryPlan.status)}>{deliveryPlan.status || 'Open'}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: false,
      render: (deliveryPlan) => (
        <div className="row-actions">
          <button
            type="button"
            aria-label="Delivery actual"
            onClick={() => onOpenDeliveryActual(deliveryPlan.deliv_id)}
          >
            <ClipboardCheck size={15} />
          </button>
          <button type="button" aria-label="Edit delivery plan" onClick={() => startEditDelivery(deliveryPlan)}>
            <Edit size={15} />
          </button>
          <button
            type="button"
            className="danger-button"
            aria-label="Hapus delivery plan"
            onClick={() => removeDeliveryPlan(deliveryPlan)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="panel">
      <div className="panel-title">
        <h2>Delivery Plan</h2>
        <div className="panel-actions">
          <button type="button" onClick={startCreateDelivery}>
            <Plus size={16} />
            Add
          </button>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>
            Refresh
          </button>
        </div>
      </div>

      {deliveryFormOpen ? (
        <form className="item-form" onSubmit={saveDeliveryPlan}>
          <label>
            Delivery No
            <input
              name="delivery_code"
              value={deliveryForm.delivery_code}
              onChange={updateDeliveryFormValue}
              required
            />
          </label>
          <label>
            Delivery Date
            <input
              name="delivery_date"
              type="date"
              value={deliveryForm.delivery_date}
              onChange={updateDeliveryFormValue}
              required
            />
          </label>
          <label>
            Item Code
            <select name="item_code" value={deliveryForm.item_code} onChange={updateDeliveryFormValue} required>
              <option value="">Select item</option>
              {items.map((item) => (
                <option key={item.id} value={item.item_code}>
                  {item.item_code}
                </option>
              ))}
            </select>
          </label>
          <label>
            Item Name
            <input value={selectedItem ? selectedItem.item_name : ''} readOnly />
          </label>
          <label>
            Customer
            <input name="customer" value={deliveryForm.customer} onChange={updateDeliveryFormValue} required />
          </label>
          <label>
            Delivery Qty
            <input
              min="1"
              name="delivery_qty"
              type="number"
              value={deliveryForm.delivery_qty}
              onChange={updateDeliveryFormValue}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={deliverySaving}>
              <Save size={16} />
              {deliverySaving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="secondary-button" onClick={resetDeliveryForm}>
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="table-filters">
        <label>
          Delivery Date From
          <input
            type="date"
            value={filterStartDate}
            onChange={(event) => setFilterStartDate(event.target.value)}
          />
        </label>

        <label>
          Delivery Date To
          <input
            type="date"
            value={filterEndDate}
            onChange={(event) => setFilterEndDate(event.target.value)}
          />
        </label>

        <div className="select2-filter">
          <span>Item Code</span>
          <button
            className="select2-button"
            type="button"
            onClick={() => setItemCodeFilterOpen((value) => !value)}
          >
            {filterItemCode || 'All item codes'}
          </button>

          {itemCodeFilterOpen ? (
            <div className="select2-menu">
              <input
                autoFocus
                value={itemCodeSearch}
                onChange={(event) => setItemCodeSearch(event.target.value)}
                placeholder="Search item code..."
              />
              <button
                className="select2-option"
                type="button"
                onClick={() => {
                  setFilterItemCode('');
                  setItemCodeSearch('');
                  setItemCodeFilterOpen(false);
                }}
              >
                All item codes
              </button>
              {filteredItemCodeOptions.map((item) => (
                <button
                  className="select2-option"
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilterItemCode(item.item_code);
                    setItemCodeSearch('');
                    setItemCodeFilterOpen(false);
                  }}
                >
                  <strong>{item.item_code}</strong>
                  <small>{item.item_name}</small>
                </button>
              ))}
              {filteredItemCodeOptions.length === 0 ? (
                <span className="select2-empty">Item code tidak ditemukan</span>
              ) : null}
            </div>
          ) : null}
        </div>

        <label>
          Status
          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="open-partial">Open &amp; Partial</option>
            <option value="Open">Open</option>
            <option value="Partial">Partial</option>
            <option value="Complete">Complete</option>
          </select>
        </label>

        <label>
          Search
          <input
            value={deliverySearch}
            onChange={(event) => setDeliverySearch(event.target.value)}
            placeholder="Delivery no, customer, item..."
          />
        </label>

        <button className="filter-clear-button" type="button" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {deliveryStatus === 'loading' ? (
        <p className="empty-state">Membaca delivery plan...</p>
      ) : deliveryStatus === 'error' ? (
        <p className="empty-state error-text">{deliveryError}</p>
      ) : (
        <DataTable
          columns={deliveryColumns}
          initialSortDirection="asc"
          initialSortKey="delivery_date"
          rowKey={(deliveryPlan) => deliveryPlan.deliv_id}
          rows={filteredDeliveryPlans}
        />
      )}
    </section>
  );
}
