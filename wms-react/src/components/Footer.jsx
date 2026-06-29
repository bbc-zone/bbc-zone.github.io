import React from 'react';
import { Copyright } from 'lucide-react';

export function Footer({ apiStatus }) {
  return (
    <footer className="footer">
      <span>{apiStatus}</span>
      <span className="copyright">
        <Copyright size={15} />
        2026 BBC Zone
      </span>
    </footer>
  );
}
