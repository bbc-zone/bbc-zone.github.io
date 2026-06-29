import React from 'react';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import {
  createItemMaster,
  deleteItemMaster,
  getItemMasterList,
  updateItemMaster,
} from '../api-connection';
import { DataTable } from '../components/DataTable';

const emptyItemForm = {
  id: null,
  item_code: '',
  item_name: '',
  category: '',
  unit: 'pcs',
  minimum_stock: 0,
  is_active: 1,
};

export function ItemMaster() {
  const [itemMasterRows, setItemMasterRows] = React.useState([]);
  const [itemMasterStatus, setItemMasterStatus] = React.useState('idle');
  const [itemMasterError, setItemMasterError] = React.useState('');
  const [itemMasterRefreshKey, setItemMasterRefreshKey] = React.useState(0);
  const [itemForm, setItemForm] = React.useState(emptyItemForm);
  const [itemFormOpen, setItemFormOpen] = React.useState(false);
  const [itemSaving, setItemSaving] = React.useState(false);
  const [itemSearch, setItemSearch] = React.useState('');

  React.useEffect(() => {
    setItemMasterStatus('loading');
    setItemMasterError('');

    getItemMasterList()
      .then((data) => {
        setItemMasterRows(data.data || []);
        setItemMasterStatus('success');
      })
      .catch((error) => {
        setItemMasterRows([]);
        setItemMasterError(error.message || 'Gagal membaca item master');
        setItemMasterStatus('error');
      });
  }, [itemMasterRefreshKey]);

  const resetItemForm = () => {
    setItemForm(emptyItemForm);
    setItemFormOpen(false);
    setItemMasterError('');
  };

  const startCreateItem = () => {
    setItemForm(emptyItemForm);
    setItemFormOpen(true);
    setItemMasterError('');
  };

  const startEditItem = (item) => {
    setItemForm({
      id: item.id,
      item_code: item.item_code,
      item_name: item.item_name,
      category: item.category || '',
      unit: item.unit,
      minimum_stock: item.minimum_stock,
      is_active: item.is_active,
    });
    setItemFormOpen(true);
    setItemMasterError('');
  };

  const updateItemFormValue = (event) => {
    const { name, value } = event.target;
    setItemForm((current) => ({
      ...current,
      [name]: name === 'minimum_stock' || name === 'is_active' ? Number(value) : value,
    }));
  };

  const saveItemMaster = (event) => {
    event.preventDefault();
    setItemSaving(true);
    setItemMasterError('');

    const action = itemForm.id ? updateItemMaster(itemForm) : createItemMaster(itemForm);

    action
      .then(() => {
        resetItemForm();
        setItemMasterRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setItemMasterError(error.message || 'Gagal menyimpan item master');
      })
      .finally(() => {
        setItemSaving(false);
      });
  };

  const removeItemMaster = (item) => {
    const confirmed = window.confirm(`Hapus item ${item.item_code}?`);

    if (!confirmed) {
      return;
    }

    setItemMasterError('');

    deleteItemMaster(item.id)
      .then(() => {
        setItemMasterRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        setItemMasterError(error.message || 'Gagal menghapus item master');
      });
  };

  const filteredItemMasterRows = itemMasterRows.filter((item) => {
    const keyword = itemSearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    const statusText = item.is_active ? 'active' : 'inactive';
    const searchableText = [
      item.item_code,
      item.item_name,
      item.category,
      item.unit,
      String(item.minimum_stock),
      statusText,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(keyword);
  });

  const itemMasterColumns = [
    {
      key: 'item_code',
      header: 'Item Code',
    },
    {
      key: 'item_name',
      header: 'Item Name',
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => item.category || '-',
    },
    {
      key: 'unit',
      header: 'Unit',
    },
    {
      key: 'minimum_stock',
      header: 'Minimum Stock',
    },
    {
      key: 'is_active',
      header: 'Status',
      sortValue: (item) => (item.is_active ? 'Active' : 'Inactive'),
      render: (item) => (
        <span className={item.is_active ? 'table-badge ok' : 'table-badge danger'}>
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: false,
      render: (item) => (
        <div className="row-actions">
          <button type="button" aria-label="Edit item" onClick={() => startEditItem(item)}>
            <Edit size={15} />
          </button>
          <button
            type="button"
            className="danger-button"
            aria-label="Hapus item"
            onClick={() => removeItemMaster(item)}
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
        <h2>Item Master</h2>
        <div className="panel-actions">
          <button type="button" onClick={startCreateItem}>
            <Plus size={16} />
            Add
          </button>
          <button type="button" onClick={() => setItemMasterRefreshKey((value) => value + 1)}>
            Refresh
          </button>
        </div>
      </div>

      {itemFormOpen ? (
        <form className="item-form" onSubmit={saveItemMaster}>
          <label>
            Item Code
            <input name="item_code" value={itemForm.item_code} onChange={updateItemFormValue} required />
          </label>
          <label>
            Item Name
            <input name="item_name" value={itemForm.item_name} onChange={updateItemFormValue} required />
          </label>
          <label>
            Category
            <input name="category" value={itemForm.category} onChange={updateItemFormValue} />
          </label>
          <label>
            Unit
            <input name="unit" value={itemForm.unit} onChange={updateItemFormValue} required />
          </label>
          <label>
            Minimum Stock
            <input
              min="0"
              name="minimum_stock"
              type="number"
              value={itemForm.minimum_stock}
              onChange={updateItemFormValue}
            />
          </label>
          <label>
            Status
            <select name="is_active" value={itemForm.is_active} onChange={updateItemFormValue}>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </label>
          <div className="form-actions">
            <button type="submit" disabled={itemSaving}>
              <Save size={16} />
              {itemSaving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="secondary-button" onClick={resetItemForm}>
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="table-filter">
        <input
          value={itemSearch}
          onChange={(event) => setItemSearch(event.target.value)}
          placeholder="Search item code, name, category..."
        />
      </div>

      {itemMasterStatus === 'loading' ? (
        <p className="empty-state">Membaca item master...</p>
      ) : itemMasterStatus === 'error' ? (
        <p className="empty-state error-text">{itemMasterError}</p>
      ) : (
        <DataTable
          columns={itemMasterColumns}
          initialSortKey="item_code"
          rowKey={(item) => item.id}
          rows={filteredItemMasterRows}
        />
      )}
    </section>
  );
}
