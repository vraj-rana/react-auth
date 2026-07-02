import { useRef } from 'react';
import './OtpDial.css';

const OtpDial = ({ value, onChange, disabled }) => {
  const digits = value.padEnd(4, ' ').slice(0, 4).split('');
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const setDigit = (index, char) => {
    const next = [...digits];
    next[index] = char;
    onChange(next.join('').replace(/ /g, ''));
  };

  const handleChange = (index) => (e) => {
    const char = e.target.value.replace(/[^0-9]/g, '').slice(-1);
    if (!char) return;
    setDigit(index, char);
    if (index < 3) refs[index + 1].current?.focus();
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === 'Backspace' && !digits[index].trim() && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  return (
    <div className="otp-dial">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          className="neu-inset otp-dial__notch"
          type="text"
          inputMode="numeric"
          value={d.trim()}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          disabled={disabled}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default OtpDial;
