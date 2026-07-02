import VaultDial from './VaultDial';

const AuthShell = ({ eyebrow, title, subtitle, dialMode = 'mark', children, footer }) => {
  return (
    <div className="auth-shell">
      <div className="auth-shell__card neu-raised">
        <div className="auth-shell__mark">
          <VaultDial mode={dialMode} size={48} />
        </div>
        {eyebrow && <p className="auth-shell__eyebrow">{eyebrow}</p>}
        <h1 className="auth-shell__title">{title}</h1>
        {subtitle && <p className="auth-shell__subtitle">{subtitle}</p>}
        <div className="auth-shell__body">{children}</div>
        {footer && <div className="auth-shell__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthShell;
