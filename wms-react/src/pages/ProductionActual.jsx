import React from 'react';
import { ArrowLeft, Edit, Plus, Save, Trash2, X } from 'lucide-react';
import {
  createProductionActual,
  deleteProductionActual,
  getProductionActual,
  updateProductionActual,
} from '../api-connection';
import { DataTable } from '../components/DataTable';

const emptyActualForm = {
  actual_id: null,
  plan_id: null,
  unique_code: '',
  actual_qty: 0,
  original_actual_qty: 0,
};

function getStatusBadgeClass(status) {
  if (status === 'Complete') {
    return 'table-badge ok';
  }

  if (status === 'Partial') {
    return 'table-badge warning';
  }

  return 'table-badge neutral';
}

export function ProductionActual({ onBack, planId }) {
  const [actualRows, setActualRows] = React.useState([]);
  const [actualStatus, setActualStatus] = React.useState('idle');
  const [actualError, setActualError] = React.useState('');
  const [actualForm, setActualForm] = React.useState(emptyActualForm);
  const [actualFormOpen, setActualFormOpen] = React.useState(false);
  const [actualSaving, setActualSaving] = React.useState(false);
  const [plan, setPlan] = React.useState(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const activePlanId = Number(planId || plan?.plan_id || actualForm.plan_id || 0);
  const planQty = Number(plan?.plan_qty || 0);
  const actualQtyTotal = Number(plan?.actual_qty_total || 0);
  const remainingQty = Math.max(planQty - actualQtyTotal, 0);
  const editingQty = actualForm.actual_id ? Number(actualForm.original_actual_qty || 0) : 0;
  const actualQtyMax = Math.max(remainingQty + editingQty, 0);
  const actualQtyMin = plan?.status === 'Complete' ? 0 : 1;
  const actualQtyValue = Number(actualForm.actual_qty || 0);
  const creatingWithoutRemainingQty = !actualForm.actual_id && actualQtyMax <= 0;
  const actualQtyInvalid =
    actualQtyValue < actualQtyMin || actualQtyValue > actualQtyMax || creatingWithoutRemainingQty;

  React.useEffect(() => {
    const requestedPlanId = Number(planId || 0);

    if (!requestedPlanId) {
      setPlan(null);
      setActualRows([]);
      setActualStatus('error');
      setActualError('Plan ID was not found');
      return;
    }

    setActualStatus('loading');
    setActualError('');

    getProductionActual(requestedPlanId)
      .then((data) => {
        setPlan(data.plan || null);
        setActualRows(data.data || []);
        setActualStatus('success');
      })
      .catch((error) => {
        setPlan(null);
        setActualRows([]);
        setActualError(error.message || 'Failed to read production actual');
        setActualStatus('error');
      });
  }, [planId, refreshKey]);

  const updateActualFormValue = (event) => {
    const { name, value } = event.target;
    setActualForm((current) => ({
      ...current,
      [name]: name === 'actual_qty' ? Number(value) : value,
    }));
  };

  const resetActualForm = () => {
    setActualForm({
      ...emptyActualForm,
      plan_id: activePlanId || null,
    });
    setActualFormOpen(false);
    setActualError('');
  };

  const startCreateActual = () => {
    setActualForm({
      ...emptyActualForm,
      plan_id: activePlanId || null,
      unique_code: '',
      actual_qty: remainingQty > 0 ? 1 : 0,
    });
    setActualFormOpen(true);
    setActualError('');
  };

  const startEditActual = (actual) => {
    setActualForm({
      actual_id: actual.actual_id,
      plan_id: actual.plan_id,
      unique_code: actual.unique_code || '',
      actual_qty: actual.actual_qty,
      original_actual_qty: actual.actual_qty,
    });
    setActualFormOpen(true);
    setActualError('');
  };

  const saveActual = (event) => {
    event.preventDefault();
    setActualSaving(true);
    setActualError('');

    if (!activePlanId && !actualForm.actual_id) {
      setActualSaving(false);
      setActualError('Plan ID was not found');
      return;
    }

    if (actualQtyInvalid) {
      setActualSaving(false);
      setActualError(`Actual qty must be between ${actualQtyMin} and ${actualQtyMax}`);
      return;
    }

    const action = actualForm.actual_id
      ? updateProductionActual(actualForm)
      : createProductionActual({
          unique_code: actualForm.unique_code,
          actual_qty: actualForm.actual_qty,
          plan_id: activePlanId,
        });

    action
      .then(() => {
        resetActualForm();
        setRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setActualError(error.message || 'Failed to save production actual');
      })
      .finally(() => {
        setActualSaving(false);
      });
  };

  const removeActual = (actual) => {
    const confirmed = window.confirm(`Hapus actual #${actual.actual_id}?`);

    if (!confirmed) {
      return;
    }

    setActualError('');

    deleteProductionActual(actual.actual_id)
      .then(() => {
        setRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setActualError(error.message || 'Failed to delete production actual');
      });
  };

  const actualColumns = [
    {
      key: 'unique_code',
      header: 'UniqueCode',
      render: (actual) => actual.unique_code || '-',
    },
    {
      key: 'actual_date',
      header: 'Actual Date',
      render: (actual) => actual.actual_date || '-',
    },
    {
      key: 'actual_qty',
      header: 'Actual Qty',
    },
    {
      key: 'action',
      header: 'Action',
      sortable: false,
      render: (actual) => (
        <div className="row-actions">
          <button type="button" aria-label="Edit production actual" onClick={() => startEditActual(actual)}>
            <Edit size={15} />
          </button>
          <button
            type="button"
            className="danger-button"
            aria-label="Hapus production actual"
            onClick={() => removeActual(actual)}
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
        <h2>Production Actual</h2>
        <div className="panel-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            <ArrowLeft size={16} />
            Back
          </button>
          <button type="button" onClick={startCreateActual}>
            <Plus size={16} />
            Add
          </button>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>
            Refresh
          </button>
        </div>
      </div>

      {actualStatus === 'loading' ? (
        <p className="empty-state">Reading production actual...</p>
      ) : actualStatus === 'error' ? (
        <p className="empty-state error-text">{actualError}</p>
      ) : (
        <>
          <div className="readonly-plan">
            <label>
              Item Code
              <input value={plan ? plan.item_code : ''} readOnly />
            </label>
            <label>
              Item Name
              <input value={plan ? plan.item_name : ''} readOnly />
            </label>
            <label>
              Plan Qty
              <input value={plan ? plan.plan_qty : ''} readOnly />
            </label>
            <label>
              Remaining Qty
              <input value={plan ? remainingQty : ''} readOnly />
            </label>
            <label>
              Plan Date
              <input value={plan && plan.plan_date ? plan.plan_date : '-'} readOnly />
            </label>
            <label>
              Status
              <span className={getStatusBadgeClass(plan ? plan.status : 'Open')}>{plan ? plan.status : 'Open'}</span>
            </label>
          </div>

          {actualFormOpen ? (
            <form className="item-form" onSubmit={saveActual}>
              <label>
                Actual Qty
                <input
                  max={actualQtyMax}
                  min={actualQtyMin}
                  name="actual_qty"
                  type="number"
                  value={actualForm.actual_qty}
                  onChange={updateActualFormValue}
                  required
                />
              </label>
              <div className="form-actions">
                <button type="submit" disabled={actualSaving || actualQtyInvalid}>
                  <Save size={16} />
                  {actualSaving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="secondary-button" onClick={resetActualForm}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : null}

          {actualError ? <p className="empty-state error-text">{actualError}</p> : null}

          <DataTable
            columns={actualColumns}
            initialSortDirection="desc"
            initialSortKey="actual_date"
            minWidth={820}
            rowKey={(actual) => actual.actual_id}
            rows={actualRows}
          />
        </>
      )}
    </section>
  );
}
