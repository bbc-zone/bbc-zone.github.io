import React from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X } from 'lucide-react';
import { getApiConnectionStatus } from './api-connection';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { FinalStep } from './pages/FinalStep';
import { ItemMaster } from './pages/ItemMaster';
import { ProductionActual } from './pages/ProductionActual';
import './styles.css';

const pageTitles = {
  dashboard: 'Dashboard WMS',
  'final-step': 'Final Step',
  'item-master': 'Item Master',
  'production-actual': 'Production Actual',
};

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [apiStatus, setApiStatus] = React.useState('Mengecek API...');
  const [apiConnecting, setApiConnecting] = React.useState(true);
  const [initialConnectionFailed, setInitialConnectionFailed] = React.useState(false);
  const [activePage, setActivePage] = React.useState(() => {
    const storedPage = window.sessionStorage.getItem('wms-active-page');
    const storedPlanId = window.sessionStorage.getItem('wms-selected-plan-id');

    if (storedPage === 'production-actual' && !storedPlanId) {
      return 'final-step';
    }

    return storedPage || 'dashboard';
  });
  const [apiErrorMessage, setApiErrorMessage] = React.useState('');
  const [selectedPlanId, setSelectedPlanId] = React.useState(() => {
    const storedPlanId = window.sessionStorage.getItem('wms-selected-plan-id');

    return storedPlanId ? Number(storedPlanId) : null;
  });
  const initialConnectionCheckRef = React.useRef(false);

  React.useEffect(() => {
    const handleApiError = (event) => {
      if (initialConnectionCheckRef.current) {
        return;
      }

      setApiErrorMessage(event.detail?.message || 'API request failed');
    };

    window.addEventListener('wms-api-error', handleApiError);

    return () => {
      window.removeEventListener('wms-api-error', handleApiError);
    };
  }, []);

  const checkApiConnection = React.useCallback(() => {
    initialConnectionCheckRef.current = true;
    setApiConnecting(true);
    setInitialConnectionFailed(false);
    setApiErrorMessage('');
    setApiStatus('Connecting to API...');

    getApiConnectionStatus()
      .then((data) => {
        setApiStatus(data.message || 'API terhubung');
        setInitialConnectionFailed(false);
      })
      .catch((error) => {
        const message = error.message || 'API connection failed';

        setApiStatus(message);
        setApiErrorMessage(message);
        setInitialConnectionFailed(true);
      })
      .finally(() => {
        initialConnectionCheckRef.current = false;
        setApiConnecting(false);
      });
  }, []);

  React.useEffect(() => {
    checkApiConnection();
  }, [checkApiConnection]);

  React.useEffect(() => {
    window.sessionStorage.setItem('wms-active-page', activePage);
  }, [activePage]);

  const openPage = (event, page) => {
    event.preventDefault();

    if (page !== 'production-actual') {
      window.sessionStorage.removeItem('wms-selected-plan-id');
      setSelectedPlanId(null);
    }

    setActivePage(page);
    setMenuOpen(false);
  };

  const openProductionActual = (planId) => {
    const nextPlanId = Number(planId);

    window.sessionStorage.setItem('wms-selected-plan-id', String(nextPlanId));
    setSelectedPlanId(nextPlanId);
    setActivePage('production-actual');
    setMenuOpen(false);
  };

  const pageTitle = pageTitles[activePage] || 'Dashboard WMS';
  const renderPage = () => {
    if (activePage === 'final-step') {
      return <FinalStep onOpenProductionActual={openProductionActual} />;
    }

    if (activePage === 'item-master') {
      return <ItemMaster />;
    }

    if (activePage === 'production-actual') {
      return (
        <ProductionActual
          planId={selectedPlanId}
          onBack={() => {
            window.sessionStorage.removeItem('wms-selected-plan-id');
            setSelectedPlanId(null);
            setActivePage('final-step');
          }}
        />
      );
    }

    return <Dashboard />;
  };

  return (
    <main className={menuOpen ? 'app-shell menu-open' : 'app-shell'}>
      <Sidebar
        activePage={activePage}
        onNavigate={openPage}
        onClose={(event) => {
          event.preventDefault();
          setMenuOpen(false);
        }}
      />
      <button
        className="menu-backdrop"
        type="button"
        aria-label="Tutup menu"
        onClick={() => setMenuOpen(false)}
      />

      <section className="workspace">
        <header className="topbar">
          <div className="title-row">
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
            <div>
              <p>Operasional Gudang</p>
              <h1>{pageTitle}</h1>
            </div>
          </div>
        </header>

        {renderPage()}

        <Footer apiStatus={apiStatus} />
      </section>

      {apiConnecting || apiErrorMessage ? (
        <div className="modal-backdrop" role="presentation">
          <div className="error-modal" role="alertdialog" aria-modal="true" aria-labelledby="api-status-title">
            <div className="error-modal-header">
              <h2 id="api-status-title">
                {apiConnecting ? 'Connecting to API...' : initialConnectionFailed ? 'API Connection Failed' : 'API Error'}
              </h2>
              {!apiConnecting && !initialConnectionFailed ? (
                <button type="button" aria-label="Tutup error" onClick={() => setApiErrorMessage('')}>
                  <X size={18} />
                </button>
              ) : null}
            </div>
            <div className="error-modal-body">
              <p>
                {apiConnecting
                  ? 'Please wait while the application checks the API and database connection.'
                  : initialConnectionFailed
                  ? 'The application cannot connect to the API server. Please check the API configuration or return to the BBC-Zone homepage.'
                  : apiErrorMessage}
              </p>
              {apiConnecting ? <div className="connecting-bar" aria-hidden="true" /> : null}
              {!apiConnecting && initialConnectionFailed ? <p className="error-detail">{apiErrorMessage}</p> : null}
            </div>
            {!apiConnecting ? (
              <div className="error-modal-footer">
                {initialConnectionFailed ? (
                <>
                  <button type="button" className="secondary-modal-button" onClick={checkApiConnection}>
                    Try Again
                  </button>
                  <button type="button" onClick={() => window.location.assign('https://bbc-zone.github.io/')}>
                    Back to BBC-Zone Homepage
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setApiErrorMessage('')}>
                  OK
                </button>
              )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
