import React from 'react';
import { activities, metrics, stockRows } from '../data/dashboard-data';

export function Dashboard() {
  return (
    <>
      <section className="metrics">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <article className="metric-card" key={item.label}>
              <span>
                <Icon size={21} />
              </span>
              <div>
                <p>{item.label}</p>
                <strong>{item.value}</strong>
                <small>{item.note}</small>
              </div>
            </article>
          );
        })}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-title">
            <h2>Aktivitas Terbaru</h2>
            <button>Refresh</button>
          </div>
          <div className="timeline">
            {activities.map((activity) => (
              <div className="timeline-row" key={activity.code}>
                <span>{activity.time}</span>
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.code}</p>
                </div>
                <em>{activity.status}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-title">
            <h2>Kesehatan Stok</h2>
            <button>Export</button>
          </div>
          <div className="stock-table">
            <div className="stock-head">
              <span>SKU</span>
              <span>Lokasi</span>
              <span>Qty</span>
              <span>Status</span>
            </div>
            {stockRows.map((row) => (
              <div className="stock-row" key={row.sku}>
                <span>
                  <strong>{row.sku}</strong>
                  <small>{row.name}</small>
                </span>
                <span>{row.zone}</span>
                <span>{row.qty}</span>
                <span className={row.level === 'Rendah' ? 'danger' : row.level === 'Perlu Refill' ? 'warning' : 'ok'}>
                  {row.level}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
