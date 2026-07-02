const ClearanceToggle = ({ value, onChange }) => {
  const options = [
    { key: 'user', label: 'Standard' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <div className="clearance-toggle">
      <span className="neu-field__label">Clearance level</span>
      <div className="neu-inset clearance-toggle__track">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`clearance-toggle__option ${value === opt.key ? 'clearance-toggle__option--active' : ''}`}
            onClick={() => onChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClearanceToggle;
