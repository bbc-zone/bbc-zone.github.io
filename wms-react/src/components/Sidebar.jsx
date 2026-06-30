import React from 'react';
import {
  Boxes,
  FileText,
  LayoutDashboard,
  PackageCheck,
  PackagePlus,
  Truck,
} from 'lucide-react';

function ReactLogo() {
  return (
    <svg className="react-logo" viewBox="-13 -12 26 24" aria-hidden="true">
      <circle cx="0" cy="0" r="2.05" />
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </svg>
  );
}

export function Sidebar({ activePage, onNavigate, onClose }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <ReactLogo />
        </span>
        <div>
          <strong>React WMS</strong>
          <a className="brand-link" href="https://bbc-zone.github.io/" target="_blank" rel="noreferrer">
            https://bbc-zone.github.io/
          </a>
        </div>
      </div>

      <nav className="nav">
        <a
          className={activePage === 'dashboard' ? 'nav-link active' : 'nav-link'}
          href="#"
          onClick={(event) => onNavigate(event, 'dashboard')}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </a>

        <div className="nav-group">
          <span className="nav-heading">WMS Transaction</span>
          <a
            className={activePage === 'final-step' ? 'nav-link nav-child active' : 'nav-link nav-child'}
            href="#"
            onClick={(event) => onNavigate(event, 'final-step')}
          >
            <PackagePlus size={18} />
            Final Step
          </a>
          <a
            className={
              activePage === 'delivery' || activePage === 'delivery-actual'
                ? 'nav-link nav-child active'
                : 'nav-link nav-child'
            }
            href="#"
            onClick={(event) => onNavigate(event, 'delivery')}
          >
            <Truck size={18} />
            Delivery
          </a>
          <a className="nav-link nav-child" href="#" onClick={onClose}>
            <Boxes size={18} />
            Inventory
          </a>
        </div>

        <div className="nav-group">
          <span className="nav-heading">WMS Report</span>
          <a className="nav-link nav-child" href="#" onClick={onClose}>
            <FileText size={18} />
            Item Report List
          </a>
        </div>

        <div className="nav-group">
          <span className="nav-heading">WMS Master</span>
          <a
            className={activePage === 'item-master' ? 'nav-link nav-child active' : 'nav-link nav-child'}
            href="#"
            onClick={(event) => onNavigate(event, 'item-master')}
          >
            <PackageCheck size={18} />
            Item Master
          </a>
        </div>
      </nav>
    </aside>
  );
}
