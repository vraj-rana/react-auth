const NeuField = ({ label, type = 'text', name, value, onChange, required, disabled, autoComplete, maxLength }) => {
  return (
    <label className="neu-field">
      <span className="neu-field__label">{label}</span>
      <input
        className="neu-inset neu-field__input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
      />
    </label>
  );
};

export default NeuField;
