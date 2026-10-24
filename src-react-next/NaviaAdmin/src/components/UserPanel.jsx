import { useEffect, useRef, useState } from 'react';

export function UserPanel({ fullname, onUserInfo, onChangePassword, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const displayName = fullname || 'Pengguna';
  const runMenuAction = (action) => {
    setIsOpen(false);
    action();
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleOutsideClick(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="user-panel-wrap" ref={panelRef}>
      <button className={`user-panel ${isOpen ? 'open' : ''}`} type="button" onClick={() => setIsOpen((current) => !current)}>
        <span className="user-avatar">{displayName.slice(0, 1).toUpperCase()}</span>
        <span className="user-info">
          <strong>{displayName}</strong>
        </span>
      </button>

      {isOpen ? (
        <div className="user-menu">
          <button type="button" onClick={() => runMenuAction(onUserInfo)}>
            Info User
          </button>
          <button type="button" onClick={() => runMenuAction(onChangePassword)}>
            Ganti Password
          </button>
          <button type="button" onClick={() => runMenuAction(onLogout)}>
            Keluar
          </button>
        </div>
      ) : null}
    </div>
  );
}
