import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthShell from '../components/AuthShell';
import NeuField from '../components/NeuField';
import OtpDial from '../components/OtpDial';
import NeuButton from '../components/NeuButton';
import StatusBanner from '../components/StatusBanner';
import { requestOtp, resetPassword, resetOtpFlow } from '../redux/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otpStage, otpError } = useSelector((s) => s.auth);

  useEffect(() => () => dispatch(resetOtpFlow()), [dispatch]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    await dispatch(requestOtp({ email }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) return;
    const result = await dispatch(resetPassword({ email, otp, newPassword }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  const step = otpStage === 'sent' ? 2 : 1;

  return (
    <AuthShell
      eyebrow={`Step ${step} of 2`}
      title={step === 1 ? 'Verify your identity' : 'Enter combination'}
      subtitle={
        step === 1
          ? 'We\u2019ll generate a one-time code for this email.'
          : `A 4-digit code was generated for ${email}. It expires in 5 minutes.`
      }
      footer={<Link className="auth-shell__link" to="/login">Back to sign in</Link>}
    >
      {step === 1 ? (
        <form className="auth-shell__body" onSubmit={handleRequestOtp}>
          <NeuField label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <StatusBanner tone="error">{otpError}</StatusBanner>
          <NeuButton type="submit" disabled={!email}>Generate code</NeuButton>
        </form>
      ) : (
        <form className="auth-shell__body" onSubmit={handleReset}>
          <OtpDial value={otp} onChange={setOtp} />
          <p className="otp-stage-label">{otp.length}/4 digits entered</p>
          <NeuField label="New password" type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoComplete="new-password" />
          <StatusBanner tone="error">{otpError}</StatusBanner>
          <div className="neu-button-row">
            <NeuButton variant="secondary" onClick={() => dispatch(resetOtpFlow())}>Back</NeuButton>
            <NeuButton type="submit" disabled={otp.length !== 4 || !newPassword}>Reset password</NeuButton>
          </div>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
