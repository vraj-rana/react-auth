const NeuButton = ({ children, onClick, type = 'button', disabled, variant = 'primary' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`neu-pressable neu-button neu-button--${variant} ${disabled ? 'neu-button--disabled' : 'neu-raised'}`}
    >
      {children}
    </button>
  );
};

export default NeuButton;
