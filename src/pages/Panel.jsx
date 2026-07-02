import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import VaultDial from '../components/VaultDial';
import { fetchUserPanel, fetchAdminPanel, logout } from '../redux/authSlice';

const Panel = ({ variant }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, name, role, panelData, panelStatus } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(variant === 'admin' ? fetchAdminPanel() : fetchUserPanel());
  }, [token, variant, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const initial = (name || 'V').charAt(0).toUpperCase();
  const displayName = name || 'Vault user';
  const isAdmin = variant === 'admin';

  // Turn whatever shape the backend hands back into simple key/value rows,
  // rather than inventing numbers the API never sent.
  const entries = panelData && typeof panelData === 'object' ? Object.entries(panelData) : [];

  return (
    <div className="panel">
      <div className="panel__header">
        <div className="panel__brand">
          <VaultDial size={34} />
          <div>
            <div className="panel__brand-text">Vaultline</div>
            <span className="panel__clearance-pill">{isAdmin ? 'Admin clearance' : 'Standard clearance'}</span>
          </div>
        </div>
        <div className="panel__actions" style={{ position: 'relative' }}>
          <div className="panel__avatar neu-raised" onClick={() => setMenuOpen((v) => !v)}>{initial}</div>
          {menuOpen && (
            <div className="panel__menu neu-raised">
              <button className="panel__menu-item" onClick={() => navigate('/change-password')}>Change password</button>
              <button className="panel__menu-item panel__menu-item--danger" onClick={handleLogout}>Sign out</button>
            </div>
          )}
        </div>
      </div>

      <h1 className="panel__section-title">Welcome, {displayName}</h1>

      <div className="panel__grid">
        <div className="panel__card neu-raised">
          <p className="panel__card-label">Role</p>
          <p className="panel__card-value">{role || variant}</p>
        </div>
        <div className="panel__card neu-raised">
          <p className="panel__card-label">Session</p>
          <p className="panel__card-value">{token ? 'Active' : 'None'}</p>
        </div>
        <div className="panel__card neu-raised">
          <p className="panel__card-label">Endpoint</p>
          <p className="panel__card-value">GET /{variant}</p>
        </div>
      </div>

      <div className="panel__card neu-raised" style={{ padding: 24 }}>
        <p className="panel__section-title" style={{ fontSize: 15, marginBottom: 12 }}>Response from /{variant}</p>
        {panelStatus === 'pending' && (
          <div className="panel__loading">
            <VaultDial mode="spinning" size={20} />
            Fetching…
          </div>
        )}
        {panelStatus === 'failed' && <p className="panel__empty">Could not load panel data for this credential.</p>}
        {panelStatus === 'succeeded' && entries.length === 0 && (
          <p className="panel__empty">The endpoint returned no additional fields.</p>
        )}
        {panelStatus === 'succeeded' && entries.length > 0 && (
          <div className="panel__list">
            {entries.map(([key, val]) => (
              <div key={key} className="panel__list-item neu-inset">
                <strong style={{ color: 'var(--ink)' }}>{key}</strong>: {typeof val === 'object' ? JSON.stringify(val) : String(val)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;
