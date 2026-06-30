import React from 'react';
import { ArrowLeft, Edit, Plus, Save, Trash2, X } from 'lucide-react';
import {
  createDeliveryActual,
  deleteDeliveryActual,
  getDeliveryActual,
  updateDeliveryActual,
} from '../api-connection';
import { DataTable } from '../components/DataTable';

const emptyActualForm = {
  actual_id: null,
  plan_id: null,
  unique_code: '',
  actual_qty: 0,
  original_actual_qty: 0,
  remarks: '',
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

export function DeliveryActual({ delivId, onBack }) {
  const uniqueCodeInputRef = React.useRef(null);
  const scannerControlsRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const [actualRows, setActualRows] = React.useState([]);
  const [actualStatus, setActualStatus] = React.useState('idle');
  const [actualError, setActualError] = React.useState('');
  const [actualForm, setActualForm] = React.useState(emptyActualForm);
  const [actualFormOpen, setActualFormOpen] = React.useState(false);
  const [actualSaving, setActualSaving] = React.useState(false);
  const [inputMode, setInputMode] = React.useState('manual');
  const [cameraActive, setCameraActive] = React.useState(false);
  const [cameraStatus, setCameraStatus] = React.useState('');
  const [plan, setPlan] = React.useState(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const activePlanId = Number(delivId || plan?.deliv_id || actualForm.plan_id || 0);
  const deliveryQty = Number(plan?.delivery_qty || 0);
  const actualQtyTotal = Number(plan?.actual_qty_total || 0);
  const remainingQty = Math.max(deliveryQty - actualQtyTotal, 0);
  const editingQty = actualForm.actual_id ? Number(actualForm.original_actual_qty || 0) : 0;
  const actualQtyMax = Math.max(remainingQty + editingQty, 0);
  const actualQtyMin = plan?.status === 'Complete' ? 0 : 1;
  const actualQtyValue = Number(actualForm.actual_qty || 0);
  const creatingWithoutRemainingQty = !actualForm.actual_id && actualQtyMax <= 0;
  const actualQtyInvalid =
    actualQtyValue < actualQtyMin || actualQtyValue > actualQtyMax || creatingWithoutRemainingQty;
  const uniqueCodeInvalid = actualForm.unique_code.trim() === '';

  React.useEffect(() => {
    const requestedPlanId = Number(delivId || 0);

    if (!requestedPlanId) {
      setPlan(null);
      setActualRows([]);
      setActualStatus('error');
      setActualError('Delivery ID was not found');
      return;
    }

    setActualStatus('loading');
    setActualError('');

    getDeliveryActual(requestedPlanId)
      .then((data) => {
        setPlan(data.plan || null);
        setActualRows(data.data || []);
        setActualStatus('success');
      })
      .catch((error) => {
        setPlan(null);
        setActualRows([]);
        setActualError(error.message || 'Failed to read delivery actual');
        setActualStatus('error');
      });
  }, [delivId, refreshKey]);

  React.useEffect(() => {
    if (actualFormOpen && inputMode === 'scan') {
      uniqueCodeInputRef.current?.focus();
    }
  }, [actualFormOpen, inputMode]);

  React.useEffect(() => {
    if (inputMode !== 'scan' || !actualFormOpen) {
      stopCamera();
    }
  }, [actualFormOpen, inputMode]);

  React.useEffect(() => () => stopCamera(), []);

  const stopCamera = React.useCallback(() => {
    if (scannerControlsRef.current) {
      scannerControlsRef.current.stop();
      scannerControlsRef.current = null;
    }

    setCameraActive(false);
  }, []);

  const startCamera = React.useCallback(async () => {
    if (!videoRef.current) {
      return;
    }

    stopCamera();
    setCameraStatus('Opening camera...');

    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const codeReader = new BrowserMultiFormatReader();
      const controls = await codeReader.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
          },
        },
        videoRef.current,
        (result) => {
          const scannedText = result?.getText();

          if (!scannedText) {
            return;
          }

          setActualForm((current) => ({
            ...current,
            unique_code: scannedText.trim(),
          }));
          setCameraStatus('Barcode scanned');
          stopCamera();
        }
      );

      scannerControlsRef.current = controls;
      setCameraActive(true);
      setCameraStatus('Camera ready');
    } catch (error) {
      setCameraStatus(error.message || 'Failed to open camera');
      setCameraActive(false);
    }
  }, [stopCamera]);

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
    stopCamera();
    setActualError('');
  };

  const startCreateActual = (mode = 'manual') => {
    setInputMode(mode);
    setActualForm({
      ...emptyActualForm,
      plan_id: activePlanId || null,
      actual_qty: remainingQty > 0 ? 1 : 0,
    });
    setActualFormOpen(true);
    setActualError('');
  };

  const startEditActual = (actual) => {
    setInputMode('manual');
    stopCamera();
    setActualForm({
      actual_id: actual.actual_id,
      plan_id: actual.plan_id,
      unique_code: actual.unique_code || '',
      actual_qty: actual.actual_qty,
      original_actual_qty: actual.actual_qty,
      remarks: actual.remarks || '',
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
      setActualError('Delivery ID was not found');
      return;
    }

    if (uniqueCodeInvalid) {
      setActualSaving(false);
      setActualError('UniqueCode is required');
      return;
    }

    if (actualQtyInvalid) {
      setActualSaving(false);
      setActualError(`Actual qty must be between ${actualQtyMin} and ${actualQtyMax}`);
      return;
    }

    const payload = {
      actual_id: actualForm.actual_id,
      unique_code: actualForm.unique_code.trim(),
      actual_qty: actualForm.actual_qty,
      plan_id: activePlanId,
      remarks: actualForm.remarks.trim(),
    };
    const action = actualForm.actual_id ? updateDeliveryActual(payload) : createDeliveryActual(payload);

    action
      .then(() => {
        const nextRemainingQty = actualForm.actual_id
          ? 0
          : Math.max(remainingQty - Number(actualForm.actual_qty || 0), 0);

        if (!actualForm.actual_id && nextRemainingQty > 0) {
          setActualForm({
            ...emptyActualForm,
            plan_id: activePlanId || null,
            actual_qty: 1,
          });
          setActualFormOpen(true);
          setActualError('');

          if (inputMode === 'scan') {
            window.setTimeout(() => uniqueCodeInputRef.current?.focus(), 0);
          }
        } else {
          resetActualForm();
        }

        setRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setActualError(error.message || 'Failed to save delivery actual');
      })
      .finally(() => {
        setActualSaving(false);
      });
  };

  const removeActual = (actual) => {
    const confirmed = window.confirm(`Hapus delivery actual #${actual.actual_id}?`);

    if (!confirmed) {
      return;
    }

    setActualError('');

    deleteDeliveryActual(actual.actual_id)
      .then(() => {
        setRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setActualError(error.message || 'Failed to delete delivery actual');
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
      key: 'remarks',
      header: 'Remarks',
      render: (actual) => actual.remarks || '-',
    },
    {
      key: 'action',
      header: 'Action',
      sortable: false,
      render: (actual) => (
        <div className="row-actions">
          <button type="button" aria-label="Edit delivery actual" onClick={() => startEditActual(actual)}>
            <Edit size={15} />
          </button>
          <button
            type="button"
            className="danger-button"
            aria-label="Hapus delivery actual"
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
        <h2>Delivery Actual</h2>
        <div className="panel-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            <ArrowLeft size={16} />
            Back
          </button>
          <button type="button" onClick={() => startCreateActual('manual')}>
            <Plus size={16} />
            Add
          </button>
          <button type="button" onClick={() => startCreateActual('scan')}>
            <Plus size={16} />
            Scan
          </button>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>
            Refresh
          </button>
        </div>
      </div>

      {actualStatus === 'loading' ? (
        <p className="empty-state">Reading delivery actual...</p>
      ) : actualStatus === 'error' ? (
        <p className="empty-state error-text">{actualError}</p>
      ) : (
        <>
          <div className="readonly-plan">
            <label>
              Delivery No
              <input value={plan ? plan.delivery_code : ''} readOnly />
            </label>
            <label>
              Delivery Date
              <input value={plan && plan.delivery_date ? plan.delivery_date : '-'} readOnly />
            </label>
            <label>
              Item Code
              <input value={plan ? plan.item_code : ''} readOnly />
            </label>
            <label>
              Item Name
              <input value={plan ? plan.item_name : ''} readOnly />
            </label>
            <label>
              Customer
              <input value={plan ? plan.customer : ''} readOnly />
            </label>
            <label>
              Delivery Qty
              <input value={plan ? plan.delivery_qty : ''} readOnly />
            </label>
            <label>
              Remaining Qty
              <input value={plan ? remainingQty : ''} readOnly />
            </label>
            <label>
              Status
              <span className={getStatusBadgeClass(plan ? plan.status : 'Open')}>{plan ? plan.status : 'Open'}</span>
            </label>
          </div>

          {actualFormOpen ? (
            <form className="item-form" onSubmit={saveActual}>
              <label>
                Input Mode
                <select value={inputMode} onChange={(event) => setInputMode(event.target.value)}>
                  <option value="manual">Manual Input</option>
                  <option value="scan">Scan Input</option>
                </select>
              </label>
              <label>
                UniqueCode
                <input
                  ref={uniqueCodeInputRef}
                  name="unique_code"
                  value={actualForm.unique_code}
                  onChange={updateActualFormValue}
                  placeholder={inputMode === 'scan' ? 'Scan barcode here...' : 'Input unique code'}
                  required
                />
              </label>
              {inputMode === 'scan' ? (
                <div className="scanner-panel">
                  <video ref={videoRef} muted playsInline />
                  <div className="scanner-actions">
                    <button type="button" onClick={startCamera} disabled={cameraActive}>
                      Open Camera
                    </button>
                    <button type="button" className="secondary-button" onClick={stopCamera} disabled={!cameraActive}>
                      Stop Camera
                    </button>
                  </div>
                  <span>{cameraStatus || 'Camera scanner is ready to start'}</span>
                </div>
              ) : null}
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
              <label>
                Remarks
                <input name="remarks" value={actualForm.remarks} onChange={updateActualFormValue} />
              </label>
              <div className="form-actions">
                <button type="submit" disabled={actualSaving || actualQtyInvalid || uniqueCodeInvalid}>
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
            minWidth={900}
            rowKey={(actual) => actual.actual_id}
            rows={actualRows}
          />
        </>
      )}
    </section>
  );
}
