import './VaultDial.css';

/**
 * The Vaultline signature mark: a combination-lock dial.
 * mode="mark"     — static, used in the nav/header
 * mode="spinning" — rotates continuously, used while a request is pending
 * mode="unlocked" — plays a single click-open rotation, used on success
 */
const VaultDial = ({ mode = 'mark', size = 40 }) => {
  return (
    <svg
      className={`vault-dial vault-dial--${mode}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vaultline"
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--ink-faint)" strokeWidth="2.5" opacity="0.35" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--brass)" strokeWidth="2.5" strokeDasharray="10 218" strokeLinecap="round" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        return (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="16"
            stroke="var(--ink-soft)"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      <g className="vault-dial__needle">
        <line x1="50" y1="50" x2="50" y2="20" stroke="var(--brass-strong)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="50" r="8" fill="var(--brass)" />
    </svg>
  );
};

export default VaultDial;
