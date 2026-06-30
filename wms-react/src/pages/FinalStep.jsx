import React from 'react';
import { ClipboardCheck, Edit, Plus, Save, Trash2, X } from 'lucide-react';
import {
  createFinalStep,
  deleteFinalStep,
  getFinalStepList,
  getItemMasterList,
  updateFinalStep,
} from '../api-connection';
import { DataTable } from '../components/DataTable';

const emptyPlanForm = {
  plan_id: null,
  item_id: '',
  plan_qty: 0,
  plan_date: '',
};

const finalStepFilterStorageKey = 'wms-final-step-filters';

function getStatusBadgeClass(status) {
  if (status === 'Complete') {
    return 'table-badge ok';
  }

  if (status === 'Partial') {
    return 'table-badge warning';
  }

  return 'table-badge neutral';
}

function getStoredFinalStepFilters() {
  try {
    const storedValue = window.sessionStorage.getItem(finalStepFilterStorageKey);

    return storedValue ? JSON.parse(storedValue) : {};
  } catch {
    return {};
  }
}

export function FinalStep({ onOpenProductionActual }) {
  const storedFilters = React.useMemo(() => getStoredFinalStepFilters(), []);
  const [plans, setPlans] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [planStatus, setPlanStatus] = React.useState('idle');
  const [planError, setPlanError] = React.useState('');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [planForm, setPlanForm] = React.useState(emptyPlanForm);
  const [planFormOpen, setPlanFormOpen] = React.useState(false);
  const [planSaving, setPlanSaving] = React.useState(false);
  const [filterStartDate, setFilterStartDate] = React.useState(storedFilters.filterStartDate || '');
  const [filterEndDate, setFilterEndDate] = React.useState(storedFilters.filterEndDate || '');
  const [filterItemCode, setFilterItemCode] = React.useState(storedFilters.filterItemCode || '');
  const [filterStatus, setFilterStatus] = React.useState(storedFilters.filterStatus || '');
  const [itemCodeSearch, setItemCodeSearch] = React.useState('');
  const [itemCodeFilterOpen, setItemCodeFilterOpen] = React.useState(false);

  React.useEffect(() => {
    setPlanStatus('loading');
    setPlanError('');

    Promise.all([getFinalStepList(), getItemMasterList()])
      .then(([planData, itemData]) => {
        setPlans(planData.data || []);
        setItems((itemData.data || []).filter((item) => item.is_active));
        setPlanStatus('success');
      })
      .catch((error) => {
        setPlans([]);
        setPlanError(error.message || 'Gagal membaca production plan');
        setPlanStatus('error');
      });
  }, [refreshKey]);

  React.useEffect(() => {
    window.sessionStorage.setItem(
      finalStepFilterStorageKey,
      JSON.stringify({
        filterStartDate,
        filterEndDate,
        filterItemCode,
        filterStatus,
      })
    );
  }, [filterStartDate, filterEndDate, filterItemCode, filterStatus]);

  const resetPlanForm = () => {
    setPlanForm(emptyPlanForm);
    setPlanFormOpen(false);
    setPlanError('');
  };

  const startCreatePlan = () => {
    setPlanForm(emptyPlanForm);
    setPlanFormOpen(true);
    setPlanError('');
  };

  const startEditPlan = (plan) => {
    setPlanForm({
      plan_id: plan.plan_id,
      item_id: plan.item_id,
      plan_qty: plan.plan_qty,
      plan_date: plan.plan_date || '',
    });
    setPlanFormOpen(true);
    setPlanError('');
  };

  const updatePlanFormValue = (event) => {
    const { name, value } = event.target;
    setPlanForm((current) => ({
      ...current,
      [name]: name === 'item_id' || name === 'plan_qty' ? Number(value) : value,
    }));
  };

  const savePlan = (event) => {
    event.preventDefault();
    setPlanSaving(true);
    setPlanError('');

    const action = planForm.plan_id ? updateFinalStep(planForm) : createFinalStep(planForm);

    action
      .then(() => {
        resetPlanForm();
        setRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setPlanError(error.message || 'Gagal menyimpan production plan');
      })
      .finally(() => {
        setPlanSaving(false);
      });
  };

  const removePlan = (plan) => {
    const confirmed = window.confirm(`Hapus production plan #${plan.plan_id}?`);

    if (!confirmed) {
      return;
    }

    setPlanError('');

    deleteFinalStep(plan.plan_id)
      .then(() => {
        setRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setPlanError(error.message || 'Gagal menghapus production plan');
      });
  };

  const selectedItem = items.find((item) => item.id === Number(planForm.item_id));
  const filteredItemCodeOptions = items.filter((item) => {
    const keyword = itemCodeSearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return `${item.item_code} ${item.item_name}`.toLowerCase().includes(keyword);
  });

  const filteredPlans = plans.filter((plan) => {
    const matchItemCode = !filterItemCode || plan.item_code === filterItemCode;
    const matchStartDate = !filterStartDate || (plan.plan_date && plan.plan_date >= filterStartDate);
    const matchEndDate = !filterEndDate || (plan.plan_date && plan.plan_date <= filterEndDate);
    const planStatusValue = plan.status || 'Open';
    const matchStatus =
      !filterStatus ||
      (filterStatus === 'open-partial'
        ? ['Open', 'Partial'].includes(planStatusValue)
        : planStatusValue === filterStatus);

    return matchItemCode && matchStartDate && matchEndDate && matchStatus;
  });

  const clearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterItemCode('');
    setFilterStatus('');
    setItemCodeSearch('');
    setItemCodeFilterOpen(false);
    window.sessionStorage.removeItem(finalStepFilterStorageKey);
  };

  const finalStepColumns = [
    {
      key: 'item_code',
      header: 'Item Code',
    },
    {
      key: 'item_name',
      header: 'Item Name',
    },
    {
      key: 'plan_qty',
      header: 'Plan Qty',
    },
    {
      key: 'plan_date',
      header: 'Plan Date',
      render: (plan) => plan.plan_date || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (plan) => <span className={getStatusBadgeClass(plan.status)}>{plan.status || 'Open'}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      sortable: false,
      render: (plan) => (
        <div className="row-actions">
          <button
            type="button"
            aria-label="Production actual"
            onClick={() => onOpenProductionActual(plan.plan_id)}
          >
            <ClipboardCheck size={15} />
          </button>
          <button type="button" aria-label="Edit production plan" onClick={() => startEditPlan(plan)}>
            <Edit size={15} />
          </button>
          <button
            type="button"
            className="danger-button"
            aria-label="Hapus production plan"
            onClick={() => removePlan(plan)}
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
        <h2>Production Plan</h2>
        <div className="panel-actions">
          <button type="button" onClick={startCreatePlan}>
            <Plus size={16} />
            Add
          </button>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>
            Refresh
          </button>
        </div>
      </div>

      {planFormOpen ? (
        <form className="item-form" onSubmit={savePlan}>
          <label>
            Item Code
            <select name="item_id" value={planForm.item_id} onChange={updatePlanFormValue} required>
              <option value="">Select item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
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
            Plan Qty
            <input
              min="1"
              name="plan_qty"
              type="number"
              value={planForm.plan_qty}
              onChange={updatePlanFormValue}
              required
            />
          </label>
          <label>
            Plan Date
            <input name="plan_date" type="date" value={planForm.plan_date} onChange={updatePlanFormValue} />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={planSaving}>
              <Save size={16} />
              {planSaving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="secondary-button" onClick={resetPlanForm}>
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="table-filters">
        <label>
          Plan Date Start
          <input
            type="date"
            value={filterStartDate}
            onChange={(event) => setFilterStartDate(event.target.value)}
          />
        </label>

        <label>
          Plan Date To
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

        <button className="filter-clear-button" type="button" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {planStatus === 'loading' ? (
        <p className="empty-state">Membaca production plan...</p>
      ) : planStatus === 'error' ? (
        <p className="empty-state error-text">{planError}</p>
      ) : (
        <DataTable
          columns={finalStepColumns}
          initialSortDirection="desc"
          initialSortKey="plan_date"
          rowKey={(plan) => plan.plan_id}
          rows={filteredPlans}
        />
      )}
    </section>
  );
}
