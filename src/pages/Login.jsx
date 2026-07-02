import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthShell from '../components/AuthShell';
import NeuField from '../components/NeuField';
import NeuButton from '../components/NeuButton';
import StatusBanner from '../components/StatusBanner';
import { loginUser, clearAuthError } from '../redux/authSlice';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, authError } = useSelector((s) => s.auth);
  const isPending = status === 'pending';
  const justRegistered = location.state?.justRegistered;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (authError) dispatch(clearAuthError());
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      const role = result.payload.role;
      navigate(role === 'admin' ? '/admin' : '/user');
    }
  };

  return (
    <AuthShell
      eyebrow="Access console"
      title="Enter the vault"
      subtitle="Sign in with your registered credential."
      dialMode={isPending ? 'spinning' : 'mark'}
      footer={
        <>
          <div style={{ marginBottom: 8 }}>
            No credential? <Link className="auth-shell__link" to="/signup">Register</Link>
          </div>
          <Link className="auth-shell__link" to="/forgot-password">Forgot password?</Link>
        </>
      }
    >
      <form className="auth-shell__body" onSubmit={handleSubmit}>
        {justRegistered && <StatusBanner tone="success">Credential created. Sign in to continue.</StatusBanner>}
        <NeuField label="Email" type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
        <NeuField label="Password" type="password" name="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
        <StatusBanner tone="error">{authError}</StatusBanner>
        <NeuButton type="submit" disabled={isPending}>
          {isPending ? 'Verifying…' : 'Sign in'}
        </NeuButton>
      </form>
    </AuthShell>
  );
};

export default Login;
